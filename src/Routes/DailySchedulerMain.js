import DailySchedulerBody from "./DailySchedulerBody";
import React, { useEffect, useState } from "react";

const DATE = new Date();
const YEAR = DATE.getFullYear();    // 2022
const MONTH = DATE.getMonth() + 1;
const TODAY = DATE.getDate();

const DailySchedulerMain = () => {
    const [month, setMonth] = useState(MONTH);
    const [year, setYear] = useState(YEAR);
    const [today, setToday] = useState(TODAY);
    const [totalDate, setTotalDate] = useState([]);

    useEffect(() => {
        function fetchInitTotalDate() {
            setTotalDate(changeSchedulerDate(month))
        }

        fetchInitTotalDate();
    }, []);

    useEffect(() => {
        setTotalDate(changeSchedulerDate(month));
      }, [month]);

    
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

    return (
        <>
            <DailySchedulerBody
                month={month}
                year={year}
                today={today}
                totalDate={totalDate}
                prevMonthLastDate={totalDate.indexOf(1)}
                nextMonthStartDate={totalDate.indexOf(1, 7)}
                
            ></DailySchedulerBody>
        </>
    )
}

export default DailySchedulerMain;