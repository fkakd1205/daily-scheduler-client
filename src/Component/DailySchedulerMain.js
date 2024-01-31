import React, { useEffect, useState } from "react";

import CommonModal from "../modal/CommonModal";
import DailySchedulerBody from "./DailySchedulerBody";
import DailySchedulerModalMain from "./modal/daily-scheduler-modal/DailySchedulerModalMain";
import MonthlySchedulerModalMain from "./modal/monthly-scheduler-modal/MonthlySchedulerModalMain";

const JANUARY = 1;
const DECEMBER = 12;

export default function DailySchedulerMain() {
    const [today, setToday] = useState(null);
    const [searchYear, setSearchYear] = useState(null)
    const [searchMonth, setSearchMonth] = useState(null)
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [totalDate, setTotalDate] = useState([]);
    
    const [dailySchedulerModalOpen, setDailySchedulerModalOpen] = useState(false);
    const [monthlySchedulerModalOpen, setMonthlySchedulerModalOpen] = useState(false);

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

        handleChangeSchedulerDate()
    }, [searchMonth])

    const handleDailySchedulerModalOpen = () => {
        setDailySchedulerModalOpen(true);
    }

    const handleDailySchedulerModalClose = () => {
        setDailySchedulerModalOpen(false);
    }

    const handleMonthlySchedulerModalOpen = () => {
        setMonthlySchedulerModalOpen(true);
    }

    const handleMonthlySchedulerModalClose = () => {
        setMonthlySchedulerModalOpen(false);
    }

    const handleChangeSchedulerDate = () => {
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

    const handleChangePrevMonth = (e) => {
        e.preventDefault();

        if((searchMonth-1) < 1) {
            setSearchYear(searchYear - 1)
            setSearchMonth(DECEMBER)
        }else {
            setSearchMonth(searchMonth - 1)
        }
    }

    const handleChangeNextMonth = (e) => {
        e.preventDefault();

        if((searchMonth + 1) > 12) {
            setSearchYear(searchYear + 1)
            setSearchMonth(JANUARY)
        }else {
            setSearchMonth(searchMonth + 1)
        }
    }

    const handleDailyModalOpen = (e, item) => {
        e.preventDefault();

        // 선택된 날짜
        let date = new Date(searchYear, searchMonth-1, item);
        setSelectedDate(date)

        handleDailySchedulerModalOpen(true);
    }

    const isTodayDate = (item) => {
        if((item === today?.getDate()) && (searchMonth === today?.getMonth() + 1) && (searchYear === today?.getFullYear())){
            return true;
        }else {
            return false;
        }
    }

    const isThisMonthDate = (index) => {
        let prevMonthLastDate = totalDate.indexOf(1)
        let nextMonthStartDate = totalDate.indexOf(1, 7) === -1 ? totalDate.length : totalDate.indexOf(1, 7)
        
        if(index < prevMonthLastDate || index >= nextMonthStartDate) {
            return false;
        }else {
            return true;
        }
    }

    const handleMonthlyModalOpen = (e) => {
        e.preventDefault();
                
        handleMonthlySchedulerModalOpen(true);
    }

    return (
        <>
            <div className="schedule-body">
                <DailySchedulerBody
                    searchYear={searchYear}
                    searchMonth={searchMonth}
                    totalDate={totalDate}

                    handleDailyModalOpen={handleDailyModalOpen}
                    isTodayDate={isTodayDate}
                    isThisMonthDate={isThisMonthDate}
                    handleMonthlyModalOpen={handleMonthlyModalOpen}

                    handleChangePrevMonth={handleChangePrevMonth}
                    handleChangeNextMonth={handleChangeNextMonth}
                />
            </div>

            {/* 일간 스케쥴러 모달창 */}
            <CommonModal
                open={dailySchedulerModalOpen}
                onClose={() => handleDailySchedulerModalClose()}
                maxWidth={'md'}
                fullWidth={true}
            >
                <DailySchedulerModalMain
                    today={today}
                    searchYear={searchYear}
                    searchMonth={searchMonth}
                    selectedDate={selectedDate}

                    onClose={() => handleDailySchedulerModalClose()}
                />
            </CommonModal>

            {/* 월간 스케쥴러 모달창 */}
            <CommonModal
                open={monthlySchedulerModalOpen}
                onClose={handleMonthlySchedulerModalClose}
                maxWidth={'md'}
                fullWidth={true}
            >
                <MonthlySchedulerModalMain
                    searchYear={searchYear}
                    searchMonth={searchMonth}
                    totalDate={totalDate}

                    onClose={handleMonthlySchedulerModalClose}
                />
            </CommonModal>
        </>
    )
}
