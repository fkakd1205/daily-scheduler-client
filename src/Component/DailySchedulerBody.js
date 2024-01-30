import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getWeekDayName } from "../utils/dateUtils"
import { Container, CalendarHead, CalendarFooter, CalendarBody, MonthControlBtn, DayInfo, DateBody, DateItem } from './styles/Body.styled';

const WEEKDAY = getWeekDayName()

const DailySchedulerBody = (props) => {
    return (
        <Container>
            <CalendarHead>
                <span>{props.searchYear} Daily Scheduler</span>
                <span>{props.searchMonth} 월</span>
                <div>
                    <MonthControlBtn onClick={(e) => props.handleChangePrevMonth(e)}><ArrowBackIcon /></MonthControlBtn>
                    <MonthControlBtn onClick={(e) => props.handleChangeNextMonth(e)}><ArrowForwardIcon /></MonthControlBtn>
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
                                onClick={(e) => props.handleDailyModalOpen(e, item)}
                                className={props.isToday(item) ? 'today' : '' || props.isThisMonthDate(index) ? '' : 'not-today'}
                            >
                                <span>{item}</span>
                            </DateItem>
                        )
                    })}
                </DateBody>
            </CalendarBody>

            <CalendarFooter>
                <button onClick={(e) => props.handleMonthlyModalOpen(e)}>
                    월별 진행률
                </button>
            </CalendarFooter>
        </Container>
    )
}

export default DailySchedulerBody;