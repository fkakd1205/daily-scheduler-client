import styled from 'styled-components';
import React, { useEffect, useReducer, useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { dateToYYYYMMDDhhmm } from '../handler/dateHandler';
import Checkbox from '@mui/material/Checkbox';

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
`;

const CategoryBtn = styled.button`
    width: 100%;
    padding: 5%;
    border: none;
    background: linear-gradient(to bottom right, #bfe5ff, #73c9ff);
    border-radius: 5px;
    color: white;
    font-weight: 550;
    font-size: 1rem;

    &:hover {
        background: linear-gradient(to bottom right, #73c9ff, #bfe5ff);
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
    width: 80%;
    border-bottom: 0.5px solid #000;
    height: 3vw;
    font-size: 1rem;
    padding: 10px;
`;

const ContentAddBtn = styled.button`
    text-align: center;
    background: none;
    border: 1px solid #000;
    transition: 0.4s;
    background-color: white;
    border-radius: 50%;
    padding: 5px;
    align-content: center;

    &:hover{
        transform: scale(1.1);
        color: #56bfff;
        border: 1px solid #56bfff;
    }
    &:active{
        transition: 0.1s;
        transform: scale(1.05);
        color: #8fd3ff;
        border: 1px solid #8fd3ff;
    }
`;

const ViewBox = styled.div`
    padding : 3% 4%;
`;

const BodyWrapper = styled.div`
    padding: 2%;
    background-color: #eee;
    border-radius: 5px;
    min-height: 30vh;
    max-height: 30vh;
    overflow: auto;
    font-size: 14px;
`;

const DataGroup = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 8% 7% 50% 15% 15% 5%);
    column-gap: 5px;
    padding: 10px 20px;
    align-items: center;
    justify-items: center;
`;

const initialScheduleContentValueState = null;

const scheduleContentValueStateReducer =  (state, action) => {
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

const CreateDailySchedulerComponent = (props) => {
    const [scheduleContentValueState, dispatchScheduleContentValueState] = useReducer(scheduleContentValueStateReducer, initialScheduleContentValueState);
    const [completedScheduleInfoList, setCompletedScheduleInfoList] = useState([]);

    useEffect(() => {
        async function getInitData() {
            if(props.dailySchedulerCategory) {
                return;
            }
            
            await props.searchDailySchedulerCategoryControl();
            await props.searchScheduleInfoControl();
        }

        getInitData();
    }, [])

    useEffect(() => {
        function getCompletedSchedule() {
            if(!props.scheduleInfo) {
                return;
            }
            
            let completedIdList = props.scheduleInfo.filter(r => r.completed)[0]?.id;
            if(completedIdList) {
                setCompletedScheduleInfoList([completedIdList]);
            }
        }

        getCompletedSchedule();
    }, [props.scheduleInfo])

    const onChangeContentInputValue = (e) => {
        e.preventDefault();

        dispatchScheduleContentValueState({
            type: 'SET_DATA',
            payload: {
                name : e.target.name,
                value : e.target.value
            }
        });
    }

    const onClickScheduleCategory = (e, categoryId) => {
        e.preventDefault();

        dispatchScheduleContentValueState({
            type: 'SET_DATA',
            payload: {
                name : 'categoryId',
                value : categoryId
            }
        });
    }

    const scheduleSubmit = async (e) => {
        e.preventDefault();

        await props.scheduleContentSubmitControl(scheduleContentValueState);
    }

    const convertCategoryName = (categoryId) => {
        return props.dailySchedulerCategory?.filter(r => r.id === categoryId)[0].name;
    }

    const scheduleStatusControl = () => {
        return {
            isChecked: function (scheduleId) {
                return completedScheduleInfoList?.includes(scheduleId);
            },
            checkOne: function (e, scheduleId) {
                e.preventDefault();

                setCompletedScheduleInfoList(completedScheduleInfoList.concat(scheduleId));
            }
        }
    }

    return (
        <Container>
            <form onSubmit={(e) => scheduleSubmit(e)}>
                <HeaderContainer>
                    <HeaderTitle>등록</HeaderTitle>
                    <CloseBtn><CancelIcon fontSize="large"/></CloseBtn>
                </HeaderContainer>
                <BodyContainer>
                    <CreateBox>
                        <ScheduleCategoryBox>
                            {props.dailySchedulerCategory?.map((r, index) => {
                                return (
                                    <CategoryBtn key={`scheduler_category_idx` + index} onClick={(e) => onClickScheduleCategory(e, r.id)}>{r.name}</CategoryBtn>
                                )
                            })}
                        </ScheduleCategoryBox>
                        <ScheduleContentBox>
                             <ContentInput type="text" name="content" onChange={(e) => onChangeContentInputValue(e)} value={scheduleContentValueState?.content || ''} required></ContentInput>
                             <ContentAddBtn type="submit"><AddIcon /></ContentAddBtn>
                        </ScheduleContentBox>
                    </CreateBox>
                    <ViewBox>
                        <BodyWrapper>
                            <DataGroup>
                                <div>카테고리</div>
                                <div>완료여부</div>
                                <div>스케쥴</div>
                                <div>등록일</div>
                                <div>완료일</div>
                                <div>삭제</div>
                            </DataGroup>
                            {props.scheduleInfo?.map((r, index) => {
                                return (
                                    <DataGroup key={`scheduler_info_idx` + index}>
                                        <div>{convertCategoryName(r.categoryId)}</div>
                                        <div>
                                            <Checkbox
                                                onClick={(e) => scheduleStatusControl().checkOne(e, r.id)}
                                                checked={scheduleStatusControl().isChecked(r.id)}
                                            />
                                        </div>
                                        <div>{r.content}</div>
                                        <div>{dateToYYYYMMDDhhmm(r.createdAt)}</div>
                                        <div>{r.completedAt ? dateToYYYYMMDDhhmm(r.completedAt) : ''}</div>
                                        <div>X</div>
                                    </DataGroup>
                                )
                            })}
                        </BodyWrapper>
                    </ViewBox>
                </BodyContainer>
            </form>
        </Container>
    )
}

export default CreateDailySchedulerComponent;