import { useEffect, useReducer, useState } from "react";
import MonthlySchedulerModalBody from "./MonthlySchedulerModalBody";
import { dailySchedulerCategoryDataConnect } from "../../../data_connect/dailySchedulerCategoryDataConnect";
import { dailySchedulerDataConnect } from "../../../data_connect/dailySchedulerDataConnect";
import { getEndDate, getStartDate } from "../../../handler/dateHandler";

export default function MonthlySchedulerModalMain(props) {
    const [scheduleSortingInfoState, dispatchScheduleSortingInfoState] = useReducer(scheduleSortingInfoReducer, initialScheduleSortingInfo);
    const [completedScheduleInfoList, setCompletedScheduleInfoList] = useState([]);
    const [progressionRate, setProgressionRate] = useState(0);

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

        if(!(props.searchYear && props.searchMonth && props.totalDate)) {
            return;
        }

        let firstDate = new Date(props.searchYear, props.searchMonth-1, 1);
        let lastDate = new Date(props.searchYear, props.searchMonth-1, props.totalDate[props.totalDate.lastIndexOf(1)-1]);

        // 이번달 1일
        let startDate = getStartDate(firstDate);
        // 다음달 1일의 -1 index
        let endDate = getEndDate(lastDate);


        getDailySchedule(startDate, endDate)
    }, [props.searchYear, props.searchMonth, props.totalDate])

    useEffect(() => {
        function getCompletedSchedule() {            
            let completedIdList = schedules.filter(r => r.completed).map(r => r.id);
            if(completedIdList) {
                setCompletedScheduleInfoList(completedIdList);
            }

            // 진행률
            let rate = 0;
            if(schedules.length !== 0){
                rate = Math.round((completedIdList.length / schedules.length) * 100);
            }
            setProgressionRate(rate);
        }

        if(!schedules) {
            return;
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
                let newData = [...schedules];

                if (scheduleSortingInfoState?.categoryId !== 'total') {
                    newData = newData?.filter(r => r.categoryId === scheduleSortingInfoState?.categoryId);
                }

                if(scheduleSortingInfoState?.completed !== 'total') {
                    newData = newData?.filter(r => JSON.parse(scheduleSortingInfoState.completed) === r.completed);
                }

                setSchedules(newData)
            }
        }
    }

    const convertCategoryName = (categoryId) => {
        return categories?.filter(r => r.id === categoryId)[0].name;
    }

    const __dataConnectControl = () => {
        return {
            searchCategories: async function () {
                await dailySchedulerCategoryDataConnect().searchDailySchedulerCategory()
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
            }
        }
    }

    return (
        <>
            <MonthlySchedulerModalBody
                scheduleSortingInfoState={scheduleSortingInfoState}
                progressionRate={progressionRate}

                searchMonth={props.searchMonth}
                categories={categories}
                schedules={schedules}

                onCloseModal={onCloseModal}
                viewSelectControl={viewSelectControl}
                convertCategoryName={convertCategoryName}
                scheduleStatusControl={scheduleStatusControl}
            />
        </>
    )
}

const initialScheduleSortingInfo = null;

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