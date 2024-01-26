import React, { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getWeekDayName } from "../utils/dateUtils"
import { Container, CalendarHead, CalendarFooter, CalendarBody, MonthControlBtn, DayInfo, DateBody, DateItem } from './styles/Body.styled';

const WEEKDAY = getWeekDayName()

const DailySchedulerBody = (props) => {
    return (
        <Container>
            <CalendarHead>
                <span>{props.dateInfoState.year} Daily Scheduler</span>
                <span>{props.dateInfoState.month} 월</span>
                <div>
                    <MonthControlBtn onClick={(e) => props.changeMonthControl().moveAndGetPrevMonth(e)}><ArrowBackIcon /></MonthControlBtn>
                    <MonthControlBtn onClick={(e) => props.changeMonthControl().moveAndGetNextMonth(e)}><ArrowForwardIcon /></MonthControlBtn>
                </div>
            </CalendarHead>

            <CalendarBody>
                <DayInfo>
                    {WEEKDAY.map((day, index) => {
                        return(
                            <div key={'weekday_index' + index}>{day}</div>
                        )
                    })}
                </DayInfo>
                <DateBody>
                    {props.totalDate?.map((item, index) => {
                        return (
                            <DateItem key={'date_item_idx' + index}
                                onClick={(e) => props.schedulerItemControl().open(e, item)}
                                className={props.schedulerItemControl().isToday(item) ? 'today' : '' || props.schedulerItemControl().isThisMonthDate(index) ? '' : 'other-month'}
                            >
                                <span>{item}</span>
                            </DateItem>
                        )
                    })}
                </DateBody>
            </CalendarBody>

            <CalendarFooter>
                <button onClick={(e) => props.monthlySchedulerControl().open(e)}>
                    월별 진행률
                </button>
            </CalendarFooter>
        </Container>
    )
}

export default DailySchedulerBody;