import { useEffect, useReducer, useState } from "react";
import MonthlySchedulerModalBody from "./MonthlySchedulerModalBody";

export default function MonthlySchedulerModalMain(props) {
    const [scheduleValueState, dispatchScheduleValueState] = useReducer(scheduleValueStateReducer, initialScheduleValueState);
    const [scheduleSortingInfoState, dispatchScheduleSortingInfoState] = useReducer(scheduleSortingInfoReducer, initialScheduleSortingInfo);
    const [completedScheduleInfoList, setCompletedScheduleInfoList] = useState([]);
    const [progressionRate, setProgressionRate] = useState(0);

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

            // 진행률
            let rate = 0;
            if(props.scheduleInfo.length !== 0){
                rate = Math.round((completedIdList.length / props.scheduleInfo.length) * 100);
            }
            setProgressionRate(rate);
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
        <>
            <MonthlySchedulerModalBody
                scheduleValueState={scheduleValueState}
                scheduleSortingInfoState={scheduleSortingInfoState}
                progressionRate={progressionRate}

                dateInfoState={props.dateInfoState}
                dailySchedulerCategory={props.dailySchedulerCategory}

                onCloseModal={onCloseModal}
                viewSelectControl={viewSelectControl}
                convertCategoryName={convertCategoryName}
                scheduleStatusControl={scheduleStatusControl}
            />
        </>
    )
}

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