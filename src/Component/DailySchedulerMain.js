import React, { useEffect, useState, useReducer } from "react";

import CommonModal from "../modal/CommonModal";
import DailySchedulerBody from "./DailySchedulerBody";
import { dailySchedulerCategoryDataConnect } from "../data_connect/dailySchedulerCategoryDataConnect"
import { dailySchedulerDataConnect } from "../data_connect/dailySchedulerDataConnect";
import { getStartDate, getEndDate } from "../handler/dateHandler"
import DailySchedulerModalMain from "./modal/daily-scheduler-modal/DailySchedulerModalMain";
import MonthlySchedulerModalMain from "./modal/monthly-scheduler-modal/MonthlySchedulerModalMain";

const JANUARY = 1;
const DECEMBER = 12;

const DailySchedulerMain = () => {
    // TODO :: 제거
    const [dateInfoState, dispatchDateInfoState] = useReducer(dateInfoReducer, initialDateInfoState);
    const [dailySchedulerCategory, setDailySchedulerCategory] = useState(null);
    const [scheduleInfo, setScheduleInfo] = useState(null);

    const [totalDate, setTotalDate] = useState([]);

    const [dailySchedulerModalOpen, setDailySchedulerModalOpen] = useState(false);
    const [searchMonthlySchedulerModalOpen, setSearchMonthlySchedulerModalOpen] = useState(false);

    const [selectedDateState, dispatchSelectedDateState] = useReducer(selectedDateReducer, initialSelectedDateState)

    const [today, setToday] = useState(null);
    const [searchYear, setSearchYear] = useState(null)
    const [searchMonth, setSearchMonth] = useState(null)
    
    const[selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if(today) {
            return;
        }

        let d = new Date()
        setToday(d)
        setSearchYear(d.getFullYear())
        setSearchMonth(d.getMonth() + 1)
    }, [])

    useEffect(() => {
        if(!searchMonth) {
            return
        }

        changeSchedulerDate()
    }, [searchMonth])

    const onDailySchedulerModalOpen = () => {
        setDailySchedulerModalOpen(true);
    }

    const onCreateDailySchedulerModalClose = () => {
        setDailySchedulerModalOpen(false);
    }

    const onSearchMonthlySchedulerModalOpen = () => {
        setSearchMonthlySchedulerModalOpen(true);
    }

    const onSearchMonthlySchedulerModalClose = () => {
        setSearchMonthlySchedulerModalOpen(false);
    }

    const changeSchedulerDate = () => {
        // day는 0-7까지 반환하며, 0: 일요일, 1: 월요일 ...
        let lastDayOfPrevMonth = new Date(searchYear, searchMonth - 1, 0).getDay();
        let lastDateOfPrevMonth = new Date(searchYear, searchMonth - 1, 0).getDate();

        let lastDayOfThisMonth = new Date(searchYear, searchMonth, 0).getDay();
        let lastDateOfThisMonth = new Date(searchYear, searchMonth, 0).getDate();

        let prevMonthCalendar = [];
        let thisMonthCalendar = [...Array(lastDateOfThisMonth + 1).keys()].slice(1);
        let nextMonthCalendar = [];

        // 전달의 마지막 요일이 토요일로 끝났다면 계산하지 않아도 된다
        if(lastDayOfPrevMonth !== 6) {
            for(let i = 0; i < lastDayOfPrevMonth + 1; i++) {
                prevMonthCalendar.unshift(lastDateOfPrevMonth - i);
            }

            for(let i = 1; i < 7 - lastDayOfThisMonth; i++) {
                nextMonthCalendar.push(i);
            }
        }

        // prev month, this month, new month의 calendar을 하나의 배열에 저장
        let totalCalendar = prevMonthCalendar.concat(thisMonthCalendar, nextMonthCalendar);
        setTotalDate(totalCalendar)
    }

    const changeMonth = () => {
        return {
            moveAndGetPrevMonth: function (e) {
                e.preventDefault();

                if((searchMonth-1) < 1) {
                    setSearchYear(searchYear - 1)
                    setSearchMonth(DECEMBER)
                }else {
                    setSearchMonth(searchMonth - 1)
                }
            },
            moveAndGetNextMonth: function(e) {
                e.preventDefault();

                if((searchMonth + 1) > 12) {
                    setSearchYear(searchYear + 1)
                    setSearchMonth(JANUARY)
                }else {
                    setSearchMonth(searchMonth + 1)
                }
            }
        }
    }

    const schedulerItem = () => {
        return {
            open: function (e, item) {
                e.preventDefault();

                // 선택된 날짜
                let date = new Date(searchYear, searchMonth-1, item);
                setSelectedDate(date)

                onDailySchedulerModalOpen(true);
            },
            isToday: function (item) {
                if((item === today?.getDate())
                     && (searchMonth === today?.getMonth() + 1)
                     && (searchYear === today?.getFullYear())){
                        return true;
                }else {
                    return false;
                }
            },
            isThisMonthDate: function (index) {
                let prevMonthLastDate = totalDate.indexOf(1)
                let nextMonthStartDate = totalDate.indexOf(1, 7) === -1 ? totalDate.length : totalDate.indexOf(1, 7)
                
                if(index < prevMonthLastDate || index >= nextMonthStartDate) {
                    return false;
                }else {
                    return true;
                }
            }
        }
    }

    const monthlyScheduler = () => {
        return {
            open: function (e) {
                e.preventDefault();

                // 이번달 1일
                let firstDate = getStartDate(new Date(searchYear, searchMonth-1, 1));
                // 다음달 1일의 -1 index
                let lastDate = getEndDate(new Date(searchYear, searchMonth-1, totalDate[totalDate.lastIndexOf(1)-1]));

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
                        alert(res?.memo);
                    })
            },
            // createSchdule: async function (data) {
            //     await dailySchedulerDataConnect().createScheduleContent(data)
            //         .then(res => {
            //             if (res.status === 200 && res.data.message === "success") {
            //                 alert('저장되었습니다.');
            //                 __dataConnectControl().searchSchduleInfo();
            //             }
            //         })
            //         .catch(err => {
            //             let res = err.response;
            //             alert(res?.memo);
            //         })
            // },
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
                        alert(res?.memo);
                    })
            },
            // changeScheduleData: async function (data) {
            //     await dailySchedulerDataConnect().changeScheduleData(data)
            //         .then(res => {
            //             if (res.status === 200 && res.data.message === "success") {
            //                 __dataConnectControl().searchSchduleInfo();
            //             }
            //         })
            //         .catch(err => {
            //             let res = err.response;
            //             alert(res?.memo);
            //         })
            // },
            // updateScheduleData: async function (data) {
            //     await dailySchedulerDataConnect().updateScheduleData(data)
            //         .then(res => {
            //             if (res.status === 200 && res.data.message === "success") {
            //                 alert('완료되었습니다.');
            //                 __dataConnectControl().searchSchduleInfo();
            //             }
            //         })
            //         .catch(err => {
            //             let res = err.response;
            //             alert(res?.memo);
            //         })
            // }
        }
    }

    return (
        <>
            <div className="schedule-body">
                <DailySchedulerBody
                    searchYear={searchYear}
                    searchMonth={searchMonth}
                    totalDate={totalDate}

                    schedulerItemControl={() => schedulerItem()}
                    monthlySchedulerControl={() => monthlyScheduler()}
                    changeMonthControl={() => changeMonth()}
                />
            </div>

            {/* 일간 스케쥴러 모달창 */}
            <CommonModal
                open={dailySchedulerModalOpen}
                onClose={() => onCreateDailySchedulerModalClose()}
                maxWidth={'md'}
                fullWidth={true}
            >
                <DailySchedulerModalMain
                    today={today}
                    searchYear={searchYear}
                    searchMonth={searchMonth}
                    selectedDate={selectedDate}

                    onClose={() => onCreateDailySchedulerModalClose()}
                    // scheduleInfoSubmitControl={(data) => __dataConnectControl().createSchdule(data)}
                    // scheduleDeleteControl={(scheduleId) => __dataConnectControl().deleteSchedule(scheduleId)}
                    // changeScheduleDataControl={(data) => __dataConnectControl().changeScheduleData(data)}
                    // updateScheduleDataControl={(data) => __dataConnectControl().updateScheduleData(data)}
                />
            </CommonModal>

            {/* 월간 스케쥴러 모달창 */}
            <CommonModal
                open={searchMonthlySchedulerModalOpen}
                onClose={() => onSearchMonthlySchedulerModalClose()}
                maxWidth={'md'}
                fullWidth={true}
            >
                <MonthlySchedulerModalMain
                    dailySchedulerCategory={dailySchedulerCategory}
                    scheduleInfo={scheduleInfo}
                    dateInfoState={dateInfoState}

                    onClose={() => onSearchMonthlySchedulerModalClose()}
                    searchDailySchedulerCategoryControl={() => __dataConnectControl().searchScheduleCategory()}
                    searchScheduleInfoControl={() => __dataConnectControl().searchSchduleInfo()}
                    scheduleDeleteControl={(scheduleId) => __dataConnectControl().deleteSchedule(scheduleId)}
                />
            </CommonModal>
        </>
    )
}

export default DailySchedulerMain;

const initialSelectedDateState = null;
const initialDateInfoState = null;

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
            return initialSelectedDateState;
        default: return { ...state }
    }
}

const dateInfoReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_DATA':
            return {
                ...state,
                today: action.payload.today ?? state.today,
                year: action.payload.year ?? state.year,
                month: action.payload.month ?? state.month,
            }
        case 'CLEAR':
            return initialDateInfoState;
        default: return { ...state }
    }
}