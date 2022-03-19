import styled from 'styled-components';
import React, { useEffect, useReducer, useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import { dateToYYYYMMDD } from '../handler/dateHandler';
import Checkbox from '@mui/material/Checkbox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Container = styled.div`
    min-height: 80vh;
    max-height: 80vh;
`;

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 1px solid #000;
    justify-content: space-between;
    width: 100%;
`;

const HeaderTitle = styled.span`
    font-size: 1.4rem;
    font-weight: 700;
    padding: 0 5%;
`;

const CloseBtn = styled.button`
    background: none;
    border:none;
    padding: 1.2% 3%;
    transition: 0.4s;
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

const BodyContainer = styled.div`
    /* background-color: blue; */
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
    padding: 10px;
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
    /* padding: 2%; */
    background-color: #eeeeeeb3;
    border-radius: 5px;
    min-height: 35vh;
    max-height: 35vh;
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
    grid-template-columns: repeat(6, 10% 10% 50% 10% 10% 10%);
    column-gap: 5px;
    padding: 10px 20px;
    align-items: center;
    justify-items: center;
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

const EditControl = styled.button`
    padding: 1% 4%;
    float: right;
    margin: 10px;
    border: none;
    background-color: #bdc7e7;
    font-size: 1rem;
    font-weight: 500;

`;

const initialScheduleInfoValueState = null;
const initialScheduleEditValueState = null;

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

const scheduleEditValueStateReducer =  (state, action) => {
    switch (action.type) {
        case 'INIT_DATA': 
            return action.payload;
        // TODO :: SET_DATA 설정하기
        case 'SET_DATA': 
            return state;
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const CreateDailySchedulerComponent = (props) => {
    const [scheduleInfoValueState, dispatchScheduleInfoValueState] = useReducer(scheduleInfoValueStateReducer, initialScheduleInfoValueState);
    const [scheduleEditValueState, dispatchScheduleEditValueState] = useReducer(scheduleEditValueStateReducer, initialScheduleEditValueState);
    const [completedScheduleInfoList, setCompletedScheduleInfoList] = useState([]);
    const [checkedScheduleInfoList, setCheckedScheduleInfoList] = useState([]);

    useEffect(() => {
        async function getInitData() {
            await props.searchDailySchedulerCategoryControl();
            await props.searchScheduleInfoControl();
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
    }, [props.scheduleInfo])

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

    const scheduleContentDelete = async (e, sheduleId) => {
        e.preventDefault();

        if(window.confirm('정말 삭제하시겠습니다?')){
            await props.scheduleDeleteControl(sheduleId);
        }
    }

    const updateSchedule = async (e) => {
        e.preventDefault();
        await props.updateScheduleDataControl(scheduleEditValueState);
    }

    return (
        <Container>
            <form onSubmit={(e) => scheduleSubmit(e)}>
                <HeaderContainer>
                    <HeaderTitle>등록</HeaderTitle>
                    <CloseBtn onClick={(e) => onCloseModal(e)}><CancelIcon fontSize="large"/></CloseBtn>
                </HeaderContainer>
                <BodyContainer>
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
                             <ContentAddBtn type="submit"><AddCircleIcon fontSize="large"/></ContentAddBtn>
                        </ScheduleContentBox>
                    </CreateBox>
                    <ViewBox>
                        <BodyWrapper>
                            <DataGroup className="fixed-header">
                                <DataText>카테고리</DataText>
                                <DataText>완료여부</DataText>
                                <DataText>스케쥴</DataText>
                                <DataText>등록일</DataText>
                                <DataText>완료일</DataText>
                                <DataText>삭제</DataText>
                            </DataGroup>
                            {scheduleEditValueState?.map((r, index) => {
                                return (
                                    <DataGroup key={`scheduler_info_idx` + index}>
                                        <DataText name="categoryId">{convertCategoryName(r.categoryId)}</DataText>
                                        <DataText name="completed">
                                            <Checkbox
                                                onClick={scheduleStatusControl().isCompleted(r.id) ? 
                                                    () => scheduleStatusControl().cancelOne(r.id) 
                                                    :
                                                    (e) => scheduleStatusControl().checkOne(e, r.id)}
                                                checked={scheduleStatusControl().isChecked(r.id)}
                                            />
                                        </DataText>
                                        <DataText name="content">{r.content}</DataText>
                                        <DataText>{dateToYYYYMMDD(r.createdAt)}</DataText>
                                        <DataText>{r.completedAt ? dateToYYYYMMDD(r.completedAt) : ''}</DataText>
                                        <DeleteBtn onClick={(e) => scheduleContentDelete(e, r.id)}><DeleteForeverIcon /></DeleteBtn>
                                    </DataGroup>
                                )
                            })}
                        </BodyWrapper>
                        <EditControl onClick={(e) => updateSchedule(e)}>
                            <span>수정 완료</span>
                        </EditControl>
                    </ViewBox>
                </BodyContainer>
            </form>
        </Container>
    )
}

export default CreateDailySchedulerComponent;