import React, { useEffect, useReducer, useState } from "react";
import DailySchedulerModalBody from "./DailySchedulerModalBody";
import { dailySchedulerCategoryDataConnect } from "../../../data_connect/dailySchedulerCategoryDataConnect";
import { dailySchedulerDataConnect } from "../../../data_connect/dailySchedulerDataConnect";
import { getEndDate, getStartDate } from "../../../handler/dateHandler";

export default function DailySchedulerModalMain(props) {
    const [scheduleInputValueState, dispatchScheduleInputValueState] = useReducer(scheduleInputValueStateReducer, initialScheduleInputValueState);
    const [scheduleSortingInfoState, dispatchScheduleSortingInfoState] = useReducer(scheduleSortingInfoReducer, initialScheduleSortingInfo);
    const [checkedScheduleInfoList, setCheckedScheduleInfoList] = useState([]);

    const [categories, setCategories] = useState(null);
    const [schedules, setSchedules] = useState(null);

    const [updatedScheduleList, setUpdatedScheduleList] = useState(null)

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
            setUpdatedScheduleList([...schedules])
        }

        function getCompletedSchedule() {
            if(!schedules) {
                return;
            }
            
            let completedIdList = schedules.filter(r => r.completed).map(r => r.id);
            if(completedIdList) {
                setCheckedScheduleInfoList(completedIdList);
            }
        }

        if(!schedules) {
            return;
        }

        initSchedule();
        getCompletedSchedule();
    }, [schedules]);

    // 선택된 카테고리로 스케쥴 조회
    useEffect(() => {
        function changeSort() {
            if(!(scheduleSortingInfoState && schedules)) {
                return;
            }

            handleChangeSortingView()
        }
        changeSort();
    }, [scheduleSortingInfoState, schedules])

    const onCloseModal = (e) => {
        e.preventDefault();
        props.onClose();
    }
    
    const onChangeScheduleInputValue = (e) => {
        e.preventDefault();

        dispatchScheduleInputValueState({
            type: 'SET_DATA',
            payload: {
                name : e.target.name,
                value : e.target.value
            }
        });
    }

    const scheduleSubmit = async (e) => {
        e.preventDefault();

        if(!scheduleInputValueState.categoryId){
            alert('카테고리를 선택해주세요.')
            return;
        }

        let date = props.selectedDate
        let startDate = getStartDate(date);
        let endDate = getEndDate(date);

        await __dataConnectControl().createSchdule(scheduleInputValueState);
        await __dataConnectControl().searchSchedules(startDate, endDate);
        await props.__searchScheduleSummary();

        dispatchScheduleInputValueState({
            type: 'CLEAR'
        });
    }

    const convertCategoryName = (categoryId) => {
        return categories?.filter(r => r.id === categoryId)[0].name;
    }

    const isChecked = (scheduleId) => {
        return checkedScheduleInfoList?.includes(scheduleId);
    }

    const handleCheckOne = async (e, scheduleId) => {
        e.preventDefault();
        let completed = false

        if (e.target.checked) {
            if (!window.confirm('완료처리 하시겠습니까?')) {
                return;
            }
            completed = true
        } else {
            if (!window.confirm('정말 취소하시겠습니까?')) {
                return;
            }
        }

        let data = {
            id: scheduleId,
            completed
        }

        let date = props.selectedDate;
        let startDate = getStartDate(date);
        let endDate = getEndDate(date);

        await __dataConnectControl().updateCompletedSchedule(data);
        await __dataConnectControl().searchSchedules(startDate, endDate);
        await props.__searchScheduleSummary();
    }

    const handleChangeScheduleEditValue = (e, scheduleId) => {
        let newData = updatedScheduleList?.map(r => {
            if(r.id === scheduleId){
                r = {
                    ...r,
                    [e.target.name] : e.target.value
                }
            }
            
            return r;
        });

        setUpdatedScheduleList([...newData])
    }

    const handleChangeSortingValue = (e) => {
        let value = e.target.value;

        dispatchScheduleSortingInfoState({
            type: 'SET_DATA',
            payload: {
                [e.target.name]: value
            }
        });
    }

    const handleChangeSortingView = () => {
        let newData = schedules;

        if (scheduleSortingInfoState?.categoryId !== 'total') {
            newData = newData?.filter(r => r.categoryId === scheduleSortingInfoState?.categoryId);
        }

        if (scheduleSortingInfoState?.completed !== 'total') {
            newData = newData?.filter(r => JSON.parse(scheduleSortingInfoState.completed) === r.completed);
        }

        setUpdatedScheduleList([...newData])
    }

    const scheduleContentDelete = async (e, sheduleId) => {
        e.preventDefault();

        if(window.confirm('정말 삭제하시겠습니다?')){
            let date = props.selectedDate
            let startDate = getStartDate(date);
            let endDate = getEndDate(date);

            await __dataConnectControl().deleteSchedule(sheduleId);
            await __dataConnectControl().searchSchedules(startDate, endDate);
            await props.__searchScheduleSummary();
        }
    }

    const updateSchedule = async (e) => {
        e.preventDefault();

        if(!updatedScheduleList.length) {
            alert('완료되었습니다.');
            return;
        }

        let date = props.selectedDate
        let startDate = getStartDate(date);
        let endDate = getEndDate(date);

        await __dataConnectControl().updateScheduleList(updatedScheduleList);
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
            updateCompletedSchedule: async function (data) {
                await dailySchedulerDataConnect().updateCompletedSchedule(data)
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
                scheduleInputValueState={scheduleInputValueState}
                updatedScheduleList={updatedScheduleList}
                scheduleSortingInfoState={scheduleSortingInfoState}

                scheduleSubmit={scheduleSubmit}
                onCloseModal={onCloseModal}
                onChangeScheduleInputValue={onChangeScheduleInputValue}
                updateSchedule={updateSchedule}
                convertCategoryName={convertCategoryName}
                isChecked={isChecked}
                handleCheckOne={handleCheckOne}
                handleChangeSortingValue={handleChangeSortingValue}
                handleChangeScheduleEditValue={handleChangeScheduleEditValue}
                scheduleContentDelete={scheduleContentDelete}
            />
        </>
    )    
}

const initialScheduleInputValueState = null;
const initialScheduleSortingInfo = null;

const scheduleInputValueStateReducer =  (state, action) => {
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