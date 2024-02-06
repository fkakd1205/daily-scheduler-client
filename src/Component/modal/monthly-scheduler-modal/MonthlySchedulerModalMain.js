import { useEffect, useReducer, useState } from "react";
import MonthlySchedulerModalBody from "./MonthlySchedulerModalBody";
import { dailySchedulerCategoryDataConnect } from "../../../data_connect/dailySchedulerCategoryDataConnect";
import { dailySchedulerDataConnect } from "../../../data_connect/dailySchedulerDataConnect";
import { getEndDate, getStartDate } from "../../../handler/dateHandler";

export default function MonthlySchedulerModalMain(props) {
    const [scheduleSortingInfoState, dispatchScheduleSortingInfoState] = useReducer(scheduleSortingInfoReducer, initialScheduleSortingInfo);
    const [progressionRate, setProgressionRate] = useState(0);

    const [categories, setCategories] = useState(null);
    const [schedules, setSchedules] = useState(null);
    const [sortedchedules, setSortedSchedules] = useState(null);

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
        if(!sortedchedules) {
            return;
        }

        handleSetProgressionRate();
    }, [sortedchedules]);

    // 선택된 카테고리로 스케쥴 조회
    useEffect(() => {
        if(!(scheduleSortingInfoState && schedules)) {
            return;
        }

        handleChangeSortingView();
    }, [scheduleSortingInfoState, schedules])

    const onCloseModal = (e) => {
        e.preventDefault();
        props.onClose();
    }

    const handleSetProgressionRate = () => {
        let completedIdList = []
        sortedchedules.forEach(r => {
            if (r.completed) {
                completedIdList.push(r.id)
            }
        });

        // 진행률
        let rate = 0;
        if (sortedchedules.length !== 0) {
            rate = Math.round((completedIdList.length / sortedchedules.length) * 100);
        }
        setProgressionRate(rate);
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
        let newData = [...schedules];

        if (scheduleSortingInfoState?.categoryId !== 'total') {
            newData = newData?.filter(r => r.categoryId === scheduleSortingInfoState?.categoryId);
        }

        if (scheduleSortingInfoState?.completed !== 'total') {
            newData = newData?.filter(r => JSON.parse(scheduleSortingInfoState.completed) === r.completed);
        }

        setSortedSchedules(newData)
    }

    const convertCategoryName = (categoryId) => {
        return categories?.filter(r => r.id === categoryId)[0].name;
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
                schedules={sortedchedules}

                onCloseModal={onCloseModal}
                handleChangeSortingValue={handleChangeSortingValue}
                handleChangeSortingView={handleChangeSortingView}
                convertCategoryName={convertCategoryName}
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