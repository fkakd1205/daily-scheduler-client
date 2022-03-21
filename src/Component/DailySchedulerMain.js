import React, { useEffect, useState, useReducer } from "react";

import CreateDailySchedulerComponent from "../modal/CreateDailySchedulerComponent";
import DailySchedulerCommonModal from "../modal/DailySchedulerCommonModal";
import DailySchedulerBody from "./DailySchedulerBody";
import { dailySchedulerCategoryDataConnect } from "../data_connect/dailySchedulerCategoryDataConnect"
import { dailySchedulerDataConnect } from "../data_connect/dailySchedulerDataConnect";
import { getStartDate, getEndDate } from "../handler/dateHandler"
import SearchMonthlySchedulerComponent from "../modal/SearchMonthlySchedulerComponent";


const TODAY = new Date();
const YEAR = TODAY.getFullYear();    // 2022
const MONTH = TODAY.getMonth() + 1;
const DATE = TODAY.getDate();

const initialSelectedDateState = null;

const selectedDateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_DATA':
            return {
                ...state,
                date: action.payload.date,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const DailySchedulerMain = () => {
    // Date Info
    const [year, setYear] = useState(YEAR);
    const [month, setMonth] = useState(MONTH);
    const [date, setDate] = useState(DATE);
    const [totalDate, setTotalDate] = useState([]);
    const [todayDate, setTodayDate] = useState(TODAY);

    const [createDailySchedulerModalOpen, setCreateDailySchedulerModalOpen] = useState(false);
    const [searchMonthlySchedulerModalOpen, setSearchMonthlySchedulerModalOpen] = useState(false);

    const [dailySchedulerCategory, setDailySchedulerCategory] = useState(null);
    const [scheduleInfo, setScheduleInfo] = useState(null);

    const [selectedDateState, dispatchSelectedDateState] = useReducer(selectedDateReducer, initialSelectedDateState)

    useEffect(() => {
        function fetchInitTotalDate() {
            setTotalDate(changeSchedulerDate(month));
        }

        fetchInitTotalDate();
    }, []);

    useEffect(() => {
        setTotalDate(changeSchedulerDate(month));
    }, [month]);

    const onCreateDailySchedulerModalOpen = () => {
        setCreateDailySchedulerModalOpen(true);
    }

    const onCreateDailySchedulerModalClose = () => {
        setCreateDailySchedulerModalOpen(false);
    }

    const onSearchMonthlySchedulerModalOpen = () => {
        setSearchMonthlySchedulerModalOpen(true);
    }

    const onSearchMonthlySchedulerModalClose = () => {
        setSearchMonthlySchedulerModalOpen(false);
    }
    
    const changeSchedulerDate = (month) => {
        // day는 0-7까지 반환하며, 0: 일요일, 1: 월요일 ...
        let lastDayOfPrevMonth = new Date(YEAR, month - 1, 0).getDay();
        let lastDateOfPrevMonth = new Date(YEAR, month - 1, 0).getDate();

        let lastDayOfThisMonth = new Date(YEAR, month, 0).getDay();
        let lastDateOfThisMonth = new Date(YEAR, month, 0).getDate();

        let prevMonthCalendar = [];
        let thisMonthCalendar = [...Array(lastDateOfThisMonth + 1).keys()].slice(1);
        let nextMonthCalendar = [];

        if(lastDayOfPrevMonth !== 6) {
            for(let i = 0; i < lastDayOfPrevMonth + 1; i++) {
                prevMonthCalendar.unshift(lastDateOfPrevMonth - i);
            }
        }

        for(let i = 1; i < 7 - lastDayOfThisMonth; i++) {
            nextMonthCalendar.push(i);
        }

        return prevMonthCalendar.concat(thisMonthCalendar, nextMonthCalendar);
    }

    const changeMonth = () => {
        return {
            moveAndGetPrevMonth: function (e) {
                e.preventDefault();

                let prevMonth = month - 1;

                if(prevMonth < 1) {
                    setYear(year - 1);
                    setMonth(12);
                }else {
                    setMonth(prevMonth);
                }
            },
            moveAndGetNextMonth: function(e) {
                e.preventDefault();

                let nextMonth = month + 1;

                if(nextMonth > 12) {
                    setYear(year + 1);
                    setMonth(1);
                }else {
                    setMonth(nextMonth);
                }
            }
        }
    }

    const schedulerItem = () => {
        return {
            open: function (e, item) {
                e.preventDefault();

                // 클릭한 날짜
                let date = new Date(year, month-1, item);
                let startDate = getStartDate(date);
                let endDate = getEndDate(date);

                dispatchSelectedDateState({
                    type: 'SET_DATA',
                    payload: {
                        date: item,
                        startDate: startDate,
                        endDate: endDate
                    }
                });

                onCreateDailySchedulerModalOpen(true);
            }
        }
    }

    const monthlyScheduler = () => {
        return {
            open: function (e) {
                e.preventDefault();

                // 이번달 1일
                let firstDate = getStartDate(new Date(year, month-1, 1));
                // 다음달 1일의 -1 index
                let lastDate = getEndDate(new Date(year, month-1, totalDate[totalDate.lastIndexOf(1)-1]));

                dispatchSelectedDateState({
                    type: 'SET_DATA',
                    payload: {
                        startDate: firstDate,
                        endDate: lastDate
                    }
                });

                onSearchMonthlySchedulerModalOpen(true);
            }
        }
    }

    const __dataConnectControl = () => {
        return {
            searchScheduleCategory: async function () {
                await dailySchedulerCategoryDataConnect().searchDailySchedulerCategory()
                    .then(res => {
                        if(res.status === 200 && res.data.message === "success") {
                            setDailySchedulerCategory(res.data.data);
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if(res?.status === 500) {
                            alert("undefined error.");
                            return;
                        }
                        alert(res?.memo);
                    })
            },
            searchSchduleInfo: async function () {
                await dailySchedulerDataConnect().searchSchduleInfoByDate(selectedDateState?.startDate, selectedDateState?.endDate)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            setScheduleInfo(res.data.data);
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res?.status === 500) {
                            alert("undefined error.");
                            return;
                        }
                        alert(res?.memo);
                    })
            },
            createSchdule: async function (data) {
                await dailySchedulerDataConnect().createScheduleContent(data)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            alert('저장되었습니다.');
                            __dataConnectControl().searchSchduleInfo();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res?.status === 500) {
                            alert("undefined error.");
                            return;
                        }
                        alert(res?.memo);
                    })
            },
            deleteSchedule: async function (scheduleId) {
                await dailySchedulerDataConnect().deleteScheduleData(scheduleId)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            alert('삭제되었습니다.');
                            __dataConnectControl().searchSchduleInfo();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res?.status === 500) {
                            alert("undefined error.");
                            return;
                        }
                        alert(res?.memo);
                    })
            },
            changeScheduleData: async function (data) {
                await dailySchedulerDataConnect().changeScheduleData(data)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            __dataConnectControl().searchSchduleInfo();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res?.status === 500) {
                            alert("undefined error.");
                            return;
                        }
                        alert(res?.memo);
                    })
            },
            updateScheduleData: async function (data) {
                await dailySchedulerDataConnect().updateScheduleData(data)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            alert('완료되었습니다.');
                            __dataConnectControl().searchSchduleInfo();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res?.status === 500) {
                            alert("undefined error.");
                            return;
                        }
                        alert(res?.memo);
                    })
            }
        }
    }

    return (
        <>
            <DailySchedulerBody
                month={month}
                year={year}
                date={date}
                totalDate={totalDate}
                todayDate={todayDate}
                prevMonthLastDate={totalDate.indexOf(1)}
                nextMonthStartDate={totalDate.indexOf(1, 7) === -1 ? totalDate.length : totalDate.indexOf(1, 7)}
                
                schedulerItemControl={() => schedulerItem()}
                monthlySchedulerControl={() => monthlyScheduler()}
                changeMonthControl={() => changeMonth()}
            ></DailySchedulerBody>

            <DailySchedulerCommonModal
                open={createDailySchedulerModalOpen}
                onClose={() => onCreateDailySchedulerModalClose()}
                maxWidth={'md'}
                fullWidth={true}
            >
                <CreateDailySchedulerComponent
                    dailySchedulerCategory={dailySchedulerCategory}
                    scheduleInfo={scheduleInfo}
                    selectedDateState={selectedDateState}
                    todayDate={todayDate}
                    month={month}
                    year={year}  
                
                    onClose={() => onCreateDailySchedulerModalClose()}
                    searchDailySchedulerCategoryControl={() => __dataConnectControl().searchScheduleCategory()}
                    searchScheduleInfoControl={() => __dataConnectControl().searchSchduleInfo()}
                    scheduleInfoSubmitControl={(data) => __dataConnectControl().createSchdule(data)}
                    scheduleDeleteControl={(scheduleId) => __dataConnectControl().deleteSchedule(scheduleId)}
                    changeScheduleDataControl={(data) => __dataConnectControl().changeScheduleData(data)}
                    updateScheduleDataControl={(data) => __dataConnectControl().updateScheduleData(data)}
                ></CreateDailySchedulerComponent>
            </DailySchedulerCommonModal>

            <DailySchedulerCommonModal
                open={searchMonthlySchedulerModalOpen}
                onClose={() => onSearchMonthlySchedulerModalClose()}
                maxWidth={'md'}
                fullWidth={true}
            >
                <SearchMonthlySchedulerComponent
                    dailySchedulerCategory={dailySchedulerCategory}
                    scheduleInfo={scheduleInfo}
                    month={month}
                    
                    onClose={() => onSearchMonthlySchedulerModalClose()}
                    searchDailySchedulerCategoryControl={() => __dataConnectControl().searchScheduleCategory()}
                    searchScheduleInfoControl={() => __dataConnectControl().searchSchduleInfo()}
                    scheduleDeleteControl={(scheduleId) => __dataConnectControl().deleteSchedule(scheduleId)}
                ></SearchMonthlySchedulerComponent>
            </DailySchedulerCommonModal>
        </>
    )
}

export default DailySchedulerMain;