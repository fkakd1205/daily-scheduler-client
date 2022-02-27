import styled from 'styled-components';
import React, { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Container = styled.div`
`;

const CalendarHead = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 25% 50% 25%);
    justify-content: space-between;
    justify-items: center;
    font-weight: 600;
    font-size: 1.4rem;
    padding: 5px;
    height: 8vw;
    align-items: center;
`;

const MonthControlBox = styled.div`
`;

const MonthControlBtn = styled.button`
    padding: 0 10px;
    transition: 0.2s;
    background: none;
    border: none;

    &:hover {
        color: #7b7b7b;
    }

    &:active {
        color: #eee;
        transition: 0s;
    }
`;

const DayInfo = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    column-gap: 10px;
    row-gap: 10px;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 2px solid #7c7c7c;
    margin-bottom: 1%;

`;

const DateBody = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    column-gap: 10px;
    row-gap: 10px;
    justify-items: stretch;
`;

const CalendarBody = styled.div`
    background-color: #ffffff;
    box-shadow: 1px 1px 15px #a9b3d599;
    padding: 20px;
    border-radius: 15px;
`;

const DateItem = styled.div`
    padding: 10px;
    background-color: white;
    box-shadow: 1px 1px 15px #a9b3d599;
    transition: 0.3s;
    border-radius: 3px;
    min-height: 10vh;
    max-height: 10vh;

    &:hover{
        background-color: #8fd3ff;
        font-weight: 700;
        color: white;
        cursor: pointer;
    }
`;

const OtherMonthItem = styled.div`
    padding: 10px;
    background-color: #e4e4e4aa;
    box-shadow: 1px 1px 15px #a9b3d599;
    transition: 0.3s;
    border-radius: 3px;
    min-height: 10vh;
    max-height: 10vh;
    color: #969696;
`;

const DateInfoText = styled.span`
    float: right;
`;

const ScheduleContentBox = styled.div`
    min-height: 55px;
    max-height: 55px;
`;

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

const DailySchedulerBody = (props) => {
    return (
        <Container>
            <CalendarHead>
                <span>{props.year} Daily Scheduler</span>
                <span>{props.month} 월</span>
                <MonthControlBox>
                    <MonthControlBtn onClick={(e) => props.changeMonthControl().moveAndGetPrevMonth(e)}><ArrowBackIcon /></MonthControlBtn>
                    <MonthControlBtn onClick={(e) => props.changeMonthControl().moveAndGetNextMonth(e)}><ArrowForwardIcon /></MonthControlBtn>
                </MonthControlBox>
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
                            (index < props.prevMonthLastDate || index >= props.nextMonthStartDate) ?
                                <OtherMonthItem key={'date_item_idx' + index}>
                                    <DateInfoText>{item}</DateInfoText>
                                    <ScheduleContentBox>
                                    </ScheduleContentBox>
                                </OtherMonthItem>
                                :
                                <DateItem key={'date_item_idx' + index} onClick={(e) => props.schedulerItemControl().open(e)}>
                                    <DateInfoText>{item}</DateInfoText>
                                    <ScheduleContentBox>

                                    </ScheduleContentBox>
                                </DateItem>
                        )
                    })}
                </DateBody>
            </CalendarBody>
        </Container>
    )
}

export default DailySchedulerBody;