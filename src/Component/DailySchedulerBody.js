import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getWeekDayName } from "../utils/dateUtils"
import { Container, CalendarHead, CalendarFooter, CalendarBody, MonthControlBtn, DayInfo, DateBody, DateItem, Wrapper } from './styles/Body.styled';

const WEEKDAY = getWeekDayName()

const DailySchedulerBody = (props) => {
    return (
        <Container className='scheduler-body'>
            <Wrapper>
                <CalendarHead>
                    <span>{props.searchYear} Daily Scheduler</span>
                    <span>{props.searchMonth} 월</span>
                    <div className='button-box'>
                        <MonthControlBtn onClick={(e) => props.handleChangePrevMonth(e)}><ArrowBackIcon /></MonthControlBtn>
                        <MonthControlBtn onClick={(e) => props.handleChangeNextMonth(e)}><ArrowForwardIcon /></MonthControlBtn>
                    </div>
                </CalendarHead>

                <CalendarBody>
                    <DayInfo>
                        {WEEKDAY.map((day, index) => {
                            return (
                                <div key={'weekday_index' + index}>{day}</div>
                            )
                        })}
                    </DayInfo>
                    <DateBody>
                        {props.totalDate?.map((item, index) => {
                            let isThisMonth = props.isThisMonthDate(index)

                            return (
                                <DateItem key={'date_item_idx' + index}
                                    onClick={(e) => props.handleDailyModalOpen(e, item)}
                                    className={`${(isThisMonth && props.isTodayDate(item)) ? 'today' : ''} ${isThisMonth ? '' : 'other-month-date'}`}
                                >
                                    <span>{item}</span>
                                </DateItem>
                            )
                        })}
                    </DateBody>
                </CalendarBody>

                <CalendarFooter>
                    <button className='button-box' onClick={(e) => props.handleMonthlyModalOpen(e)}>
                        <div>
                            월별 진행률
                        </div>
                        <div>
                            <img
                                src={'/assets/icons/calendar_month_ffffff.svg'}
                            />
                        </div>
                    </button>
                </CalendarFooter>
            </Wrapper>
        </Container>
    )
}

export default DailySchedulerBody;