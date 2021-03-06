import React, { useEffect, useState, useReducer } from "react";

import CreateDailySchedulerComponent from "../modal/CreateDailySchedulerComponent";
import DailySchedulerCommonModal from "../modal/DailySchedulerCommonModal";
import DailySchedulerBody from "./DailySchedulerBody";
import { dailySchedulerCategoryDataConnect } from "../data_connect/dailySchedulerCategoryDataConnect"
import { dailySchedulerDataConnect } from "../data_connect/dailySchedulerDataConnect";
import { getStartDate, getEndDate } from "../handler/dateHandler"
import SearchMonthlySchedulerComponent from "../modal/SearchMonthlySchedulerComponent";

const JANUARY = 1;
const DECEMBER = 12;

const DailySchedulerMain = () => {
    // Date Info
    const [dateInfoState, dispatchDateInfoState] = useReducer(dateInfoReducer, initialDateInfoState);
    const [totalDate, setTotalDate] = useState([]);

    const [createDailySchedulerModalOpen, setCreateDailySchedulerModalOpen] = useState(false);
    const [searchMonthlySchedulerModalOpen, setSearchMonthlySchedulerModalOpen] = useState(false);

    const [dailySchedulerCategory, setDailySchedulerCategory] = useState(null);
    const [scheduleInfo, setScheduleInfo] = useState(null);

    const [selectedDateState, dispatchSelectedDateState] = useReducer(selectedDateReducer, initialSelectedDateState)

    useEffect(() => {
        if(dateInfoState) {
            return;
        }

        // date info setting
        let date = new Date();

        dispatchDateInfoState({
            type: 'INIT_DATA',
            payload: {
                today: date,
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                todayDate: date.getDate()
            }
        });
    }, []);

    useEffect(() => {
        if(!dateInfoState) {
            return;
        }

        // total date setting
        setTotalDate(changeSchedulerDate(dateInfoState.month));
    }, [dateInfoState?.month])

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
        // day??? 0-7?????? ????????????, 0: ?????????, 1: ????????? ...
        let lastDayOfPrevMonth = new Date(dateInfoState.year, month - 1, 0).getDay();
        let lastDateOfPrevMonth = new Date(dateInfoState.year, month - 1, 0).getDate();

        let lastDayOfThisMonth = new Date(dateInfoState.year, month, 0).getDay();
        let lastDateOfThisMonth = new Date(dateInfoState.year, month, 0).getDate();

        let prevMonthCalendar = [];
        let thisMonthCalendar = [...Array(lastDateOfThisMonth + 1).keys()].slice(1);
        let nextMonthCalendar = [];

        // ????????? ????????? ????????? ???????????? ???????????? ???????????? ????????? ??????
        if(lastDayOfPrevMonth !== 6) {
            for(let i = 0; i < lastDayOfPrevMonth + 1; i++) {
                prevMonthCalendar.unshift(lastDateOfPrevMonth - i);
            }

            for(let i = 1; i < 7 - lastDayOfThisMonth; i++) {
                nextMonthCalendar.push(i);
            }
        }

        // prev month, this month, new month??? calendar??? ????????? ????????? ??????
        return prevMonthCalendar.concat(thisMonthCalendar, nextMonthCalendar);
    }

    const changeMonth = () => {
        return {
            moveAndGetPrevMonth: function (e) {
                e.preventDefault();

                if((dateInfoState.month-1) < 1) {
                    dispatchDateInfoState({
                        type: 'SET_DATA',
                        payload: {
                            year: dateInfoState.year - 1,
                            month: DECEMBER
                        }
                    })
                }else {
                    dispatchDateInfoState({
                        type: 'SET_DATA',
                        payload: {
                            month: dateInfoState.month - 1
                        }
                    });
                }
            },
            moveAndGetNextMonth: function(e) {
                e.preventDefault();

                if((dateInfoState.month + 1) > 12) {
                    dispatchDateInfoState({
                        type: 'SET_DATA',
                        payload: {
                            year: dateInfoState.year + 1,
                            month: JANUARY
                        }
                    })
                }else {
                    dispatchDateInfoState({
                        type: 'SET_DATA',
                        payload: {
                            month: dateInfoState.month + 1
                        }
                    })
                }
            }
        }
    }

    const schedulerItem = () => {
        return {
            open: function (e, item) {
                e.preventDefault();

                // ????????? ??????
                let date = new Date(dateInfoState.year, dateInfoState.month-1, item);
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
            },
            isToday: function (item) {
                if((item === dateInfoState.today?.getDate())
                     && (dateInfoState.month === dateInfoState.today?.getMonth() + 1)
                     && (dateInfoState.year === dateInfoState.today?.getFullYear())){
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

                // ????????? 1???
                let firstDate = getStartDate(new Date(dateInfoState.year, dateInfoState.month-1, 1));
                // ????????? 1?????? -1 index
                let lastDate = getEndDate(new Date(dateInfoState.year, dateInfoState.month-1, totalDate[totalDate.lastIndexOf(1)-1]));

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
            createSchdule: async function (data) {
                await dailySchedulerDataConnect().createScheduleContent(data)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            alert('?????????????????????.');
                            __dataConnectControl().searchSchduleInfo();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.memo);
                    })
            },
            deleteSchedule: async function (scheduleId) {
                await dailySchedulerDataConnect().deleteScheduleData(scheduleId)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            alert('?????????????????????.');
                            __dataConnectControl().searchSchduleInfo();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
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
                        alert(res?.memo);
                    })
            },
            updateScheduleData: async function (data) {
                await dailySchedulerDataConnect().updateScheduleData(data)
                    .then(res => {
                        if (res.status === 200 && res.data.message === "success") {
                            alert('?????????????????????.');
                            __dataConnectControl().searchSchduleInfo();
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
        dateInfoState &&
        <div className="schedule-body">
            <DailySchedulerBody
                dateInfoState={dateInfoState}
                totalDate={totalDate}

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
                    dateInfoState={dateInfoState}

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
                    dateInfoState={dateInfoState}

                    onClose={() => onSearchMonthlySchedulerModalClose()}
                    searchDailySchedulerCategoryControl={() => __dataConnectControl().searchScheduleCategory()}
                    searchScheduleInfoControl={() => __dataConnectControl().searchSchduleInfo()}
                    scheduleDeleteControl={(scheduleId) => __dataConnectControl().deleteSchedule(scheduleId)}
                ></SearchMonthlySchedulerComponent>
            </DailySchedulerCommonModal>
        </div>
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
                todayDate: action.payload.todayDate ?? state.todayDate
            }
        case 'CLEAR':
            return initialDateInfoState;
        default: return { ...state }
    }
}