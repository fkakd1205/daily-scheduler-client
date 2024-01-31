import React, { useEffect, useReducer, useState } from "react";
import DailySchedulerModalBody from "./DailySchedulerModalBody";
import { dailySchedulerCategoryDataConnect } from "../../../data_connect/dailySchedulerCategoryDataConnect";
import { dailySchedulerDataConnect } from "../../../data_connect/dailySchedulerDataConnect";
import { getEndDate, getStartDate } from "../../../handler/dateHandler";

export default function DailySchedulerModalMain(props) {
    const [scheduleInfoValueState, dispatchScheduleInfoValueState] = useReducer(scheduleInfoValueStateReducer, initialScheduleInfoValueState);
    const [scheduleEditValueState, dispatchScheduleEditValueState] = useReducer(scheduleEditValueStateReducer, initialScheduleEditValueState);
    const [scheduleSortingInfoState, dispatchScheduleSortingInfoState] = useReducer(scheduleSortingInfoReducer, initialScheduleSortingInfo);

    const [completedScheduleInfoList, setCompletedScheduleInfoList] = useState([]);
    const [checkedScheduleInfoList, setCheckedScheduleInfoList] = useState([]);

    const [categories, setCategories] = useState(null);
    const [schedules, setSchedules] = useState(null);

    useEffect(() => {
        async function getInitData() {
            await __dataConnectControl().searchCategories()

            // 기본 카테고리 select 선택
            dispatchScheduleSortingInfoState({
                type: 'INIT_DATA'
            });
        }

        getInitData();
    }, [])

    useEffect(() => {
        async function getDailySchedule(startDate, endDate) {
            await __dataConnectControl().searchSchedules(startDate, endDate)
        }
        
        if(!props.selectedDate) {
            return
        }

        let date = props.selectedDate
        let startDate = getStartDate(date);
        let endDate = getEndDate(date);

        getDailySchedule(startDate, endDate)
    }, [props.selectedDate])

    useEffect(() => {
        function initSchedule() {
            dispatchScheduleEditValueState({
                type: 'INIT_DATA',
                payload: schedules
            });
        }
        
        if(!schedules) {
            return;
        }

        initSchedule();
    }, [schedules]);

    useEffect(() => {
        function getCompletedSchedule() {
            if(!schedules) {
                return;
            }
            
            let completedIdList = schedules.filter(r => r.completed).map(r => r.id);
            if(completedIdList) {
                setCompletedScheduleInfoList(completedIdList);
                setCheckedScheduleInfoList(completedIdList);
            }
        }

        getCompletedSchedule();
    }, [schedules]);

    // 선택된 카테고리로 스케쥴 조회
    useEffect(() => {
        function changeSort() {
            if(!(scheduleSortingInfoState && schedules)) {
                return;
            }

            viewSelectControl().changeViewData();
        }
        changeSort();
    }, [scheduleSortingInfoState, schedules])

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

        let date = props.selectedDate
        let startDate = getStartDate(date);
        let endDate = getEndDate(date);

        await __dataConnectControl().createSchdule(scheduleInfoValueState);
        await __dataConnectControl().searchSchedules(startDate, endDate);

        dispatchScheduleInfoValueState({
            type: 'CLEAR'
        });
    }

    const convertCategoryName = (categoryId) => {
        return categories?.filter(r => r.id === categoryId)[0].name;
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

                    let date = props.selectedDate
                    let startDate = getStartDate(date);
                    let endDate = getEndDate(date);

                    await __dataConnectControl().cancelCompletedSchedule(data);
                    await __dataConnectControl().searchSchedules(startDate, endDate)
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
                let newData = schedules;

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
            let date = props.selectedDate
            let startDate = getStartDate(date);
            let endDate = getEndDate(date);

            await __dataConnectControl().deleteSchedule(sheduleId);
            await __dataConnectControl().searchSchedules(startDate, endDate);
        }
    }

    const updateSchedule = async (e) => {
        e.preventDefault();

        if(!scheduleEditValueState.length) {
            alert('변경된 데이터가 없습니다!');
            return;
        }

        let date = props.selectedDate
        let startDate = getStartDate(date);
        let endDate = getEndDate(date);

        await __dataConnectControl().updateScheduleList(scheduleEditValueState);
        await __dataConnectControl().searchSchedules(startDate, endDate)
    }

    const __dataConnectControl = () => {
        return {
            searchCategories: async function () {
                await dailySchedulerCategoryDataConnect().searchDailySchedulerCategoryAll()
                    .then(res => {
                        if(res.status === 200 && res.data.message === "success") {
                            setCategories(res.data.data)
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.memo);
                    })
            },
            searchSchedules: async function (startDate, endDate) {
                await dailySchedulerDataConnect().searchScheduleInfoByDate(startDate, endDate)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            setSchedules(res.data.data);
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.memo);
                    })
            },
            createSchdule: async function (data) {
                await dailySchedulerDataConnect().createScheduleContent(data)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            alert('저장되었습니다.');
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.memo);
                    })
            },
            deleteSchedule: async function (scheduleId) {
                await dailySchedulerDataConnect().deleteSchedule(scheduleId)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            alert('삭제되었습니다.');
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.memo);
                    })
            },
            cancelCompletedSchedule: async function (data) {
                await dailySchedulerDataConnect().cancelCompletedSchedule(data)
                    .catch(err => {
                        let res = err.response;
                        alert(res?.memo);
                    })
            },
            updateScheduleList: async function (data) {
                await dailySchedulerDataConnect().updateScheduleList(data)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            alert('완료되었습니다.');
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.memo);
                    })
            }
        }
    }

    return (
        <>
            <DailySchedulerModalBody
                selectedDate={props.selectedDate}
                today={props.today}
                searchYear={props.searchYear}
                searchMonth={props.searchMonth}

                categories={categories}
                scheduleInfoValueState={scheduleInfoValueState}
                scheduleEditValueState={scheduleEditValueState}
                scheduleSortingInfoState={scheduleSortingInfoState}

                scheduleSubmit={scheduleSubmit}
                onCloseModal={onCloseModal}
                onChangeScheduleInfoValue={onChangeScheduleInfoValue}
                updateSchedule={updateSchedule}
                viewSelectControl={viewSelectControl}
                convertCategoryName={convertCategoryName}
                scheduleStatusControl={scheduleStatusControl}
                scheduleEditControl={scheduleEditControl}
                scheduleContentDelete={scheduleContentDelete}
            />
        </>
    )    
}

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