import styled from 'styled-components';
import React, { useEffect, useReducer, useState } from "react";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { dateToYYYYMMDD } from '../handler/dateHandler';
import Checkbox from '@mui/material/Checkbox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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

const BodyContainer = styled.div`
    padding: 2% 5%;
`;

const CreateBox = styled.div`
    padding: 1%;
    border-bottom: 1px solid #d7d7d7;
`;

const ScheduleCategoryBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 4%;
    place-items: center;
    padding: 1%;

    & .schedule-category-btn-active{
        background: #94b5ca;
    }
`;

const CategoryBtn = styled.button`
    width: 100%;
    padding: 5%;
    border: none;
    background: linear-gradient(to bottom right, #d7dbff, #73c9ff);
    border-radius: 5px;
    color: white;
    font-weight: 550;
    font-size: 1rem;
    transition: 0.2s;

    &:hover {
        opacity: 0.7;
    }
`;

const ScheduleContentBox = styled.div`
    display: grid;
    grid-template-columns: 90% 10%;
    padding: 3% 10%;
    place-items: center;
`;

const ContentInput = styled.input`
    border: none;
    width: 90%;
    border-bottom: 0.5px solid #000;
    height: 3vw;
    font-size: 1rem;
    padding: 7px;
    transition: 0.3s;

    &:focus {
        outline: none;
    }
`;

const ContentAddBtn = styled.button`
    text-align: center;
    background: none;
    border: none;
    transition: 0.4s;
    align-content: center;
    color: #595959;

    &:hover{
        transform: scale(1.1);
        color: #56bfff;
    }
    &:active{
        transition: 0.1s;
        transform: scale(1.05);
        color: #8fd3ff;
    }
`;

const ViewBox = styled.div`
    padding : 3% 4%;
    padding-bottom: 7%;
`;

const BodyWrapper = styled.div`
    padding-bottom: 5%;
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
        border-bottom: none;
    }
`;

const DataGroupLi = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 10% 10% 50% 10% 10% 10%);
    column-gap: 5px;
    padding: 10px 20px;
    align-items: center;
    justify-items: center;
    border-bottom: 2px solid #d5dae94f;
`;

const DeleteBtn = styled.div`
    color: #595959;

    &:hover{
        cursor: pointer;
        transition: 0.1s;
        transform: scale(1.1);
        color: red;
    }
`;

const DataText = styled.div`
`;

const DataTextInput = styled.input`
    border: 1px solid transparent;
    background-color: transparent;
    width: 80%;
    padding: 5px;
    transition: 0.2s;
    
    &:focus{
        outline: none;
        border-bottom: 1px solid #000;
    }
`;

const EditControl = styled.button`
    padding: 1% 4%;
    float: right;
    margin: 5px;
    border: none;
    background-color: #bdc7e7;
    font-size: 1rem;
    font-weight: 500;
`;

const CategorySelect = styled.select`
    border: none;
    background-color: transparent;

    &:focus {
        outline: none;
    }
`;

const CreateDailySchedulerComponent = (props) => {
    const [scheduleInfoValueState, dispatchScheduleInfoValueState] = useReducer(scheduleInfoValueStateReducer, initialScheduleInfoValueState);
    const [scheduleEditValueState, dispatchScheduleEditValueState] = useReducer(scheduleEditValueStateReducer, initialScheduleEditValueState);
    const [scheduleSortingInfoState, dispatchScheduleSortingInfoState] = useReducer(scheduleSortingInfoReducer, initialScheduleSortingInfo);

    const [completedScheduleInfoList, setCompletedScheduleInfoList] = useState([]);
    const [checkedScheduleInfoList, setCheckedScheduleInfoList] = useState([]);

    useEffect(() => {
        async function getInitData() {
            await props.searchDailySchedulerCategoryControl();
            await props.searchScheduleInfoControl();

            // 기본 카테고리 select 선택
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

            dispatchScheduleEditValueState({
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
                setCheckedScheduleInfoList(completedIdList);
            }
        }

        getCompletedSchedule();
    }, [props.scheduleInfo]);

    // 선택된 카테고리로 스케쥴 조회
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
    
    const onChangeScheduleInfoValue = (e) => {
        e.preventDefault();

        dispatchScheduleInfoValueState({
            type: 'SET_DATA',
            payload: {
                name : e.target.name,
                value : e.target.value
            }
        });
    }

    const scheduleSubmit = async (e) => {
        e.preventDefault();

        if(!scheduleInfoValueState.categoryId){
            alert('카테고리를 선택해주세요.')
            return;
        }

        await props.scheduleInfoSubmitControl(scheduleInfoValueState);

        dispatchScheduleInfoValueState({
            type: 'CLEAR'
        });
    }

    const convertCategoryName = (categoryId) => {
        return props.dailySchedulerCategory?.filter(r => r.id === categoryId)[0].name;
    }

    const scheduleStatusControl = () => {
        return {
            isChecked: function (scheduleId) {
                return checkedScheduleInfoList?.includes(scheduleId);
            },
            isCompleted: function (scheduleId) {
                return completedScheduleInfoList?.includes(scheduleId);
            },
            checkOne: function (e, scheduleId) {
                if(e.target.checked) {
                    setCheckedScheduleInfoList(checkedScheduleInfoList.concat(scheduleId));

                    let newData = scheduleEditValueState?.map(r => {
                        if(r.id === scheduleId){
                            r.completed = true;
                        }
                        return r;
                    });

                    dispatchScheduleEditValueState({
                        type: 'SET_DATA',
                        payload: newData
                    });

                } else {
                    setCheckedScheduleInfoList(checkedScheduleInfoList.filter(r => r !== scheduleId));

                    let newData = scheduleEditValueState?.map(r => {
                        if(r.id === scheduleId){
                            r.completed = false;
                        }
                        return r;
                    });


                    dispatchScheduleEditValueState({
                        type: 'SET_DATA',
                        payload: newData
                    });
                }
            },
            cancelOne: async function (scheduleId) {
                if (window.confirm('정말 취소하시겠습니까?')) {
                    let data = {
                        id: scheduleId,
                        completed: false
                    }
                    await props.changeScheduleDataControl(data);
                }
            }
        }
    }

    const scheduleEditControl = () => {
        return {
            onChangeInputValue: function(e, scheduleId) {

                let newData = scheduleEditValueState?.map(r => {
                    if(r.id === scheduleId){
                        r = {
                            ...r,
                            [e.target.name] : e.target.value
                        }
                    }
                    
                    return r;
                });

                dispatchScheduleEditValueState({
                    type : 'SET_DATA',
                    payload: newData
                });
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

                if(scheduleSortingInfoState?.categoryId !== 'total') {
                    newData = newData?.filter(r => r.categoryId === scheduleSortingInfoState?.categoryId);
                }

                if(scheduleSortingInfoState?.completed !== 'total') {
                    newData = newData?.filter(r => JSON.parse(scheduleSortingInfoState.completed) === r.completed);
                }

                dispatchScheduleEditValueState({
                    type: 'INIT_DATA',
                    payload: newData
                });
            }
        }
    }

    const scheduleContentDelete = async (e, sheduleId) => {
        e.preventDefault();

        if(window.confirm('정말 삭제하시겠습니다?')){
            await props.scheduleDeleteControl(sheduleId);
        }
    }

    const updateSchedule = async (e) => {
        e.preventDefault();

        if(!scheduleEditValueState.length) {
            alert('변경된 데이터가 없습니다!');
            return;
        }

        await props.updateScheduleDataControl(scheduleEditValueState);
    }

    return (
        <Container>
            <form onSubmit={(e) => scheduleSubmit(e)}>
                <HeaderContainer>
                    <div className="header-top">
                        <div className="modal-title">등록 및 조회</div>
                        <IconButton className="modal-close-btn" aria-label="close" onClick={(e) => onCloseModal(e)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </HeaderContainer>
                <BodyContainer>
                    {(props.selectedDateState?.date === props.dateInfoState.todayDate) && (props.dateInfoState.month === props.dateInfoState.today?.getMonth() + 1) && (props.dateInfoState.year === props.dateInfoState.today?.getFullYear()) &&
                        <CreateBox>
                            <ScheduleCategoryBox>
                                {props.dailySchedulerCategory?.map((r, index) => {
                                    return (
                                        <CategoryBtn key={`scheduler_category_idx` + index} name="categoryId" className={scheduleInfoValueState?.categoryId === r.id ? `schedule-category-btn-active` : ''} onClick={(e) => onChangeScheduleInfoValue(e)} value={r.id}>{r.name}</CategoryBtn>
                                    )
                                })}
                            </ScheduleCategoryBox>
                            <ScheduleContentBox>
                                <ContentInput type="text" name="content" onChange={(e) => onChangeScheduleInfoValue(e)} value={scheduleInfoValueState?.content || ''} required></ContentInput>
                                <ContentAddBtn type="submit"><AddCircleIcon fontSize="large" /></ContentAddBtn>
                            </ScheduleContentBox>
                        </CreateBox>
                    }
                </BodyContainer>
            </form>

            <BodyContainer>
                <form onSubmit={(e) => updateSchedule(e)}>
                    <ViewBox>
                        <BodyWrapper>
                            <DataGroupLi className="fixed-header">
                                <CategorySelect onChange={(e) => viewSelectControl().onChangeCategoryValue(e)} value={scheduleSortingInfoState?.categoryId}>
                                    <option value='total'>카테고리</option>
                                    {props.dailySchedulerCategory?.map((r, index) => {
                                        return (
                                            <option key={`view_category_idx` + index} value={r.id}>{r.name}</option>
                                        )
                                    })}
                                </CategorySelect>
                                <CategorySelect onChange={(e) => viewSelectControl().onChangeCompletedValue(e)} value={scheduleSortingInfoState?.completed}>
                                    <option value='total'>완료여부</option>
                                    <option value={true}>완료</option>
                                    <option value={false}>미완료</option>
                                </CategorySelect>
                                <DataText>스케쥴</DataText>
                                <DataText>등록일</DataText>
                                <DataText>완료일</DataText>
                                <DataText>삭제</DataText>
                            </DataGroupLi>
                            {scheduleEditValueState?.map((r, index) => {
                                return (
                                    <DataGroupLi key={`scheduler_info_idx` + index}>
                                        <DataText name="categoryId">{convertCategoryName(r.categoryId)}</DataText>
                                        <DataText>
                                            <Checkbox
                                                onClick={scheduleStatusControl().isCompleted(r.id) ?
                                                    () => scheduleStatusControl().cancelOne(r.id)
                                                    :
                                                    (e) => scheduleStatusControl().checkOne(e, r.id)}
                                                checked={scheduleStatusControl().isChecked(r.id)}
                                            />
                                        </DataText>
                                        <DataTextInput name="content" value={r.content || ''} onChange={(e) => scheduleEditControl().onChangeInputValue(e, r.id)}></DataTextInput>
                                        <DataText>{dateToYYYYMMDD(r.createdAt)}</DataText>
                                        <DataText>{r.completedAt ? dateToYYYYMMDD(r.completedAt) : ''}</DataText>
                                        <DeleteBtn onClick={(e) => scheduleContentDelete(e, r.id)}><DeleteForeverIcon /></DeleteBtn>
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

export default CreateDailySchedulerComponent;

const initialScheduleInfoValueState = null;
const initialScheduleEditValueState = null;
const initialScheduleSortingInfo = null;

const scheduleInfoValueStateReducer =  (state, action) => {
    switch (action.type) {
        case 'INIT_DATA': 
            return action.payload;
        case 'SET_DATA': 
            return {
                ...state,
                [action.payload.name] : action.payload.value
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const scheduleEditValueStateReducer = (state, action) => {
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