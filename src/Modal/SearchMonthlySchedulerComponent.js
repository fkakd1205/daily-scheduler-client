import styled from 'styled-components';
import React, { useEffect, useReducer, useState } from "react";
import { dateToYYYYMMDD } from '../handler/dateHandler';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from '@mui/material/Checkbox';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const Container = styled.div`
`;

const HeaderContainer = styled.div`
    padding: 10px 20px;
    border-bottom: 1px solid #000;

    .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center
    }

    .modal-title {
        font-size: 1.3rem;
        font-weight: 700;
        @media only screen and (max-width:576px){
            font-size: 16px;
        }
    }

    .modal-close-btn {
        color: #5c5c7e;
        &:hover {
            color: #80808b;
        }
    }
`;

const BodyWrapper = styled.div`
    background-color: #eeeeeeb3;
    border-radius: 5px;
    min-height: 50vh;
    max-height: 50vh;
    overflow: auto;
    font-size: 14px;

    .fixed-header {
        position: sticky;
        top: -1px;
        background: #d5dae9;
        z-index:10;
    }
`;

const DataGroup = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 10% 10% 50% 15% 15%);
    column-gap: 5px;
    padding: 10px 20px;
    align-items: center;
    justify-items: center;
`;

const DataText = styled.div`
`;

const CategorySelect = styled.select`
    border: none;
    background-color: transparent;

    &:focus {
        outline: none;
    }
`;

const ProgressBox = styled.div`
    padding: 10px 20px;
    background-color: white;
`;

const useStyles = makeStyles((theme) => ({
    progressBar: {
        height: 12,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 800 : 200],
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: theme.palette.mode === 'light' ? '#a8d4ff' : '#a8d4ff',
        },
    }
}));

const SearchMonthlySchedulerComponent = (props) => {
    const classes = useStyles();
    const [scheduleValueState, dispatchScheduleValueState] = useReducer(scheduleValueStateReducer, initialScheduleValueState);
    const [scheduleSortingInfoState, dispatchScheduleSortingInfoState] = useReducer(scheduleSortingInfoReducer, initialScheduleSortingInfo);
    const [completedScheduleInfoList, setCompletedScheduleInfoList] = useState([]);
    const [progressionRate, setProgressionRate] = useState(0);

    useEffect(() => {
        async function getInitData() {
            await props.searchDailySchedulerCategoryControl();
            await props.searchScheduleInfoControl();

            // ?????? ???????????? select ??????
            dispatchScheduleSortingInfoState({
                type: 'INIT_DATA'
            });
        }

        getInitData();
    }, [])

    useEffect(() => {
        function initSchedule() {
            if(!props.scheduleInfo) {
                return;
            }

            dispatchScheduleValueState({
                type: 'INIT_DATA',
                payload: props.scheduleInfo
            });
        }
        initSchedule();
    }, [props.scheduleInfo]);

    useEffect(() => {
        function getCompletedSchedule() {
            if(!props.scheduleInfo) {
                return;
            }
            
            let completedIdList = props.scheduleInfo.filter(r => r.completed).map(r => r.id);
            if(completedIdList) {
                setCompletedScheduleInfoList(completedIdList);
            }

            // ?????????
            let rate = 0;
            if(props.scheduleInfo.length !== 0){
                rate = Math.round((completedIdList.length / props.scheduleInfo.length) * 100);
            }
            setProgressionRate(rate);
        }

        getCompletedSchedule();
    }, [props.scheduleInfo]);

    // ????????? ??????????????? ????????? ??????
    useEffect(() => {
        function changeSort() {
            if(!(scheduleSortingInfoState && props.scheduleInfo)) {
                return;
            }

            viewSelectControl().changeViewData();
        }
        changeSort();
    }, [scheduleSortingInfoState, props.scheduleInfo])

    const onCloseModal = (e) => {
        e.preventDefault();
        props.onClose();
    }

    const scheduleStatusControl = () => {
        return {
            isCompleted: function (scheduleId) {
                return completedScheduleInfoList?.includes(scheduleId);
            }
        }
    }

    const viewSelectControl = () => {
        return {
            onChangeCategoryValue: function (e) {
                let target = e.target.value;

                dispatchScheduleSortingInfoState({
                    type: 'SET_DATA',
                    payload: {
                        categoryId: target
                    }
                });
            },
            onChangeCompletedValue: function (e) {
                let target = e.target.value;

                dispatchScheduleSortingInfoState({
                    type: 'SET_DATA',
                    payload: {
                        completed: target
                    }
                });
            },
            changeViewData: function () {
                let newData = props.scheduleInfo;

                if (scheduleSortingInfoState?.categoryId !== 'total') {
                    newData = newData?.filter(r => r.categoryId === scheduleSortingInfoState?.categoryId);
                }

                if(scheduleSortingInfoState?.completed !== 'total') {
                    newData = newData?.filter(r => JSON.parse(scheduleSortingInfoState.completed) === r.completed);
                }

                dispatchScheduleValueState({
                    type: 'INIT_DATA',
                    payload: newData
                });
            }
        }
    }

    const convertCategoryName = (categoryId) => {
        return props.dailySchedulerCategory?.filter(r => r.id === categoryId)[0].name;
    }

    return (
        <Container>
            <HeaderContainer>
                <div className="header-top">
                        <div className="modal-title">{props.dateInfoState.month}??? ?????????</div>
                        <IconButton className="modal-close-btn" aria-label="close" onClick={(e) => onCloseModal(e)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
            </HeaderContainer>
            <ProgressBox>
                <span>{progressionRate ?? 0}%</span>
                <LinearProgress className={classes.progressBar} variant="determinate" value={progressionRate} />
            </ProgressBox>
            <BodyWrapper>
                <DataGroup className="fixed-header">
                    <CategorySelect onChange={(e) => viewSelectControl().onChangeCategoryValue(e)} value={scheduleSortingInfoState?.categoryId}>
                        <option value='total'>????????????</option>
                        {props.dailySchedulerCategory?.map((r, index) => {
                            return (
                                <option key={`view_category_idx` + index} value={r.id}>{r.name}</option>
                            )
                        })}
                    </CategorySelect>
                    <CategorySelect onChange={(e) => viewSelectControl().onChangeCompletedValue(e)} value={scheduleSortingInfoState?.completed}>
                        <option value='total'>????????????</option>
                        <option value={true}>??????</option>
                        <option value={false}>?????????</option>
                    </CategorySelect>
                    <DataText>?????????</DataText>
                    <DataText>?????????</DataText>
                    <DataText>?????????</DataText>
                </DataGroup>
                {scheduleValueState?.map((r, index) => {
                    return (
                        <DataGroup key={`scheduler_info_idx` + index}>
                            <DataText name="categoryId">{convertCategoryName(r.categoryId)}</DataText>
                            <DataText>
                                <Checkbox checked={scheduleStatusControl().isCompleted(r.id)}/>
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

export default SearchMonthlySchedulerComponent;

const initialScheduleValueState = null;
const initialScheduleSortingInfo = null;

const scheduleValueStateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA': 
            return action.payload;
        case 'SET_DATA': 
            return action.payload;
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const scheduleSortingInfoReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return {
                ...state,
                categoryId: 'total',
                completed: 'total'
            }
        case 'SET_DATA':
            return {
                ...state,
                categoryId: action.payload.categoryId ?? state.categoryId,
                completed: action.payload.completed ?? state.completed
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}