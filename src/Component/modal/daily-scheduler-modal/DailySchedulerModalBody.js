import { Container, HeaderContainer, BodyContainer, CreateBox, ScheduleCategoryBox, CategoryBtn, ScheduleContentBox, ContentInput, ContentAddBtn, ViewBox, BodyWrapper, DataGroupLi, DeleteBtn, DataText, DataTextInput, EditControl, CategorySelect } from "./styles/Body.styled"
import { dateToYYYYMMDD, getStartDate } from "../../../handler/dateHandler"
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@mui/material/Checkbox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function DailySchedulerModalBody(props){
    let isToday = (dateToYYYYMMDD(getStartDate(props.selectedDate)) === dateToYYYYMMDD(props.today))

    return (
        <Container>
            <form onSubmit={(e) => props.scheduleSubmit(e)}>
                <HeaderContainer>
                    <div className="header-top">
                        <div className="modal-title">등록 및 조회</div>
                        <IconButton className="modal-close-btn" aria-label="close" onClick={(e) => props.onCloseModal(e)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </HeaderContainer>
                <BodyContainer>
                    {isToday &&
                        <CreateBox>
                            <ScheduleCategoryBox>
                                {props.categories?.map((r, index) => {
                                    return (
                                        <CategoryBtn key={`scheduler_category_idx` + index} name="categoryId" className={props.scheduleInputValueState?.categoryId === r.id ? `schedule-category-btn-active` : ''} onClick={(e) => props.onChangeScheduleInputValue(e)} value={r.id}>{r.name}</CategoryBtn>
                                    )
                                })}
                            </ScheduleCategoryBox>
                            <ScheduleContentBox>
                                <ContentInput type="text" name="content" onChange={(e) => props.onChangeScheduleInputValue(e)} value={props.scheduleInputValueState?.content || ''} required></ContentInput>
                                <ContentAddBtn type="submit"><AddCircleIcon fontSize="large" /></ContentAddBtn>
                            </ScheduleContentBox>
                        </CreateBox>
                    }
                </BodyContainer>
            </form>

            <BodyContainer>
                <form onSubmit={(e) => props.updateSchedule(e)}>
                    <ViewBox>
                        <BodyWrapper>
                            <DataGroupLi className="fixed-header">
                                <CategorySelect
                                    name='categoryId'    
                                    onChange={(e) => props.handleChangeSortingValue(e)}
                                    value={props.scheduleSortingInfoState?.categoryId}
                                >
                                    <option value='total'>카테고리</option>
                                    {props.categories?.map((r, index) => {
                                        return (
                                            <option key={`view_category_idx` + index} value={r.id}>{r.name}</option>
                                        )
                                    })}
                                </CategorySelect>
                                <CategorySelect 
                                    name='completed'
                                    onChange={(e) => props.handleChangeSortingValue(e)}
                                    value={props.scheduleSortingInfoState?.completed}
                                >
                                    <option value='total'>완료여부</option>
                                    <option value={true}>완료</option>
                                    <option value={false}>미완료</option>
                                </CategorySelect>
                                <DataText>스케쥴</DataText>
                                <DataText>등록일</DataText>
                                <DataText>완료일</DataText>
                                <DataText>삭제</DataText>
                            </DataGroupLi>
                            {props.updatedScheduleList?.map((r, index) => {
                                return (
                                    <DataGroupLi key={`scheduler_info_idx` + index}>
                                        <DataText name="categoryId">{props.convertCategoryName(r.categoryId)}</DataText>
                                        <DataText>
                                            <Checkbox
                                                onClick={(e) => props.handleCheckOne(e, r.id)}
                                                checked={props.isChecked(r.id)}
                                            />
                                        </DataText>
                                        <DataTextInput name="content" value={r.content || ''} onChange={(e) => props.handleChangeScheduleEditValue(e, r.id)}></DataTextInput>
                                        <DataText>{dateToYYYYMMDD(r.createdAt)}</DataText>
                                        <DataText>{r.completedAt ? dateToYYYYMMDD(r.completedAt) : ''}</DataText>
                                        <DeleteBtn onClick={(e) => props.scheduleContentDelete(e, r.id)}><DeleteForeverIcon /></DeleteBtn>
                                    </DataGroupLi>
                                )
                            })}
                        </BodyWrapper>
                        <EditControl type="submit">
                            <span>수정 완료</span>
                        </EditControl>
                    </ViewBox>
                </form>
            </BodyContainer>
        </Container>
    )
}