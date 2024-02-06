import { dateToYYYYMMDD } from "../../../handler/dateHandler"
import { BodyWrapper, CategorySelect, Container, DataGroup, DataText, HeaderContainer, ProgressBox } from "./styles/Body.styled"
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@mui/material/Checkbox';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    progressBar: {
        [`&.${linearProgressClasses.root}`]: {
            height: 8
        },
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 800 : 200],
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: theme.palette.mode === 'light' ? '#a8d4ff' : '#a8d4ff',
        },
    }
}));

export default function MonthlySchedulerModalBody(props) {
    const classes = useStyles();

    return (
        <Container>
            <HeaderContainer>
                <div className="header-top">
                        <div className="modal-title">{props.searchMonth}월 진행률</div>
                        <IconButton className="modal-close-btn" aria-label="close" onClick={(e) => props.onCloseModal(e)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
            </HeaderContainer>
            <ProgressBox>
                <span>{props.progressionRate ?? 0}%</span>
                <LinearProgress className={classes.progressBar} variant="determinate" value={props.progressionRate} />
            </ProgressBox>
            <BodyWrapper>
                <DataGroup className="fixed-header">
                    <CategorySelect name='categoryId' onChange={(e) => props.handleChangeSortingValue(e)} value={props.scheduleSortingInfoState?.categoryId}>
                        <option value='total'>카테고리</option>
                        {props.categories?.map((r, index) => {
                            return (
                                <option key={`view_category_idx` + index} value={r.id}>{r.name}</option>
                            )
                        })}
                    </CategorySelect>
                    <CategorySelect name='completed' onChange={(e) => props.handleChangeSortingValue(e)} value={props.scheduleSortingInfoState?.completed}>
                        <option value='total'>완료여부</option>
                        <option value={true}>완료</option>
                        <option value={false}>미완료</option>
                    </CategorySelect>
                    <DataText>스케쥴</DataText>
                    <DataText>등록일</DataText>
                    <DataText>완료일</DataText>
                </DataGroup>
                {props.schedules?.map((r, index) => {
                    return (
                        <DataGroup key={`scheduler_info_idx` + index}>
                            <DataText name="categoryId">{props.convertCategoryName(r.categoryId)}</DataText>
                            <DataText>
                                <Checkbox checked={r.completed} disabled />
                            </DataText>
                            <DataText>{r.content}</DataText>
                            <DataText>{dateToYYYYMMDD(r.createdAt)}</DataText>
                            <DataText>{r.completedAt ? dateToYYYYMMDD(r.completedAt) : ''}</DataText>
                        </DataGroup>
                    )
                })}
            </BodyWrapper>
        </Container>
    )
}