import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getWeekDayName } from "../utils/dateUtils"
import { Container, CalendarHead, MonthlyCalendar, CalendarBody, MonthControlBtn, DayInfo, DateBody, DateItem, Wrapper } from './styles/Body.styled';
import { getDate } from "../handler/dateHandler";

const WEEKDAY = getWeekDayName()

const DailySchedulerBody = (props) => {
    return (
        <Container className='scheduler-body'>
            <Wrapper>
                <CalendarHead>
                    <div style={{ minWidth: 300 }}>
                        <span>{props.searchYear} Daily Scheduler</span>
                    </div>
                    <div style={{ flexGrow: 1, textAlign: 'center' }}>
                        <span>{props.searchMonth} 월</span>
                    </div>
                    <div className='button-box' style={{ minWidth: 300 }}>
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
                            let isThisMonth = props.isThisMonthDate(index);
                            let summary = isThisMonth && props.scheduleSummaries?.find(r => getDate(r.datetime) === item);
                            let weekIdx = isThisMonth && props.getThisMonthWeekday(item);
                            let dayName = WEEKDAY[weekIdx];

                            return (
                                <DateItem key={'date_item_idx' + index}
                                    onClick={(e) => props.handleDailyModalOpen(e, item)}
                                    className={`${(isThisMonth && props.isTodayDate(item)) ? 'today' : ''} ${isThisMonth ? '' : 'other-month-date'}`}
                                >
                                    <div className='date'>
                                        <span>{item} </span>
                                        {dayName && <span style={{ color: '#8c95ae' }}>({dayName})</span>}
                                    </div>
                                    {summary &&
                                        <div>
                                            <div className='preview-text'>
                                                <div className='image-box'>
                                                    <img
                                                        src="/assets/icons/check_1ac517.svg"
                                                        style={{ width: '18px' }}
                                                    />
                                                </div>
                                                <div className='count-value'>{summary.completionCount}</div>
                                            </div>
                                            <div className='preview-text'>
                                                <div className='image-box'>
                                                    <img
                                                        src="/assets/icons/check_f45151.svg"
                                                        style={{ width: '18px' }}
                                                    />
                                                </div>
                                                <div className='count-value'>{summary.registrationCount - summary.completionCount}</div>
                                            </div>
                                        </div>
                                    }
                                </DateItem>
                            )
                        })}
                    </DateBody>
                </CalendarBody>
                <MonthlyCalendar>
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
                </MonthlyCalendar>
            </Wrapper>
        </Container>
    )
}

export default DailySchedulerBody;