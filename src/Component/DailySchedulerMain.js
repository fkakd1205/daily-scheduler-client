import React, { useEffect, useState } from "react";

import CreateDailySchedulerComponent from "../modal/CreateDailySchedulerComponent";
import DailySchedulerCommonModal from "../modal/DailySchedulerCommonModal";
import DailySchedulerBody from "./DailySchedulerBody";
import { dailySchedulerCategoryDataConnect } from "../data_connect/dailySchedulerCategoryDataConnect"


const DATE = new Date();
const YEAR = DATE.getFullYear();    // 2022
const MONTH = DATE.getMonth() + 1;
const TODAY = DATE.getDate();

const DailySchedulerMain = () => {
    // Date Info
    const [month, setMonth] = useState(MONTH);
    const [year, setYear] = useState(YEAR);
    const [today, setToday] = useState(TODAY);
    const [totalDate, setTotalDate] = useState([]);

    const [createDailySchedulerModalOpen, setCreateDailySchedulerModalOpen] = useState(false);

    const [dailySchedulerCategory, setDailySchedulerCategory] = useState(null);

    useEffect(() => {
        function fetchInitTotalDate() {
            setTotalDate(changeSchedulerDate(month))
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

                setMonth(month-1);
            },
            moveAndGetNextMonth: function(e) {
                e.preventDefault();

                setMonth(month+1);
            }
        }
    }

    const schedulerItem = () => {
        return {
            open: function (e) {
                e.preventDefault();

                onCreateDailySchedulerModalOpen(true);
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
            }
        }
    }

    return (
        <>
            <DailySchedulerBody
                month={month}
                year={year}
                today={today}
                totalDate={totalDate}
                prevMonthLastDate={totalDate.indexOf(1)}
                nextMonthStartDate={totalDate.indexOf(1, 7) === -1 ? totalDate.length : totalDate.indexOf(1, 7)}
                
                schedulerItemControl={() => schedulerItem()}
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
                
                    searchDailySchedulerCategoryControl={() => __dataConnectControl().searchScheduleCategory()}
                ></CreateDailySchedulerComponent>
            </DailySchedulerCommonModal>
        </>
    )
}

export default DailySchedulerMain;