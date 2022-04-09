import styled, {css} from 'styled-components';
import React, { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Container = styled.div`
    padding-bottom: 5%;
`;

const CalendarHead = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 25% 50% 25%);
    justify-content: space-between;
    justify-items: center;
    font-weight: 600;
    font-size: 1.4rem;
    padding: 5px;
    height: 4vw;
    align-items: center;
`;

const CalendarFooter = styled.div`
    padding: 10px;
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

    &.today {
        font-weight: 700;
        background-color: #b0e0ff;
        box-shadow: 2px 2px 15px #b0e0ff;

    }

    &:hover{
        background-color: #8fd3ff;
        font-weight: 700;
        color: white;
        cursor: pointer;
    }


    @media screen and (max-width: 992px){
        min-height: 4vh;
        max-height: 4vh;
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

    @media screen and (max-width: 992px){
        min-height: 4vh;
        max-height: 4vh;
    }
`;

const DateInfoText = styled.span`
    float: right;
`;

const ScheduleContentBox = styled.div`
    min-height: 55px;
    max-height: 55px;
`;

const MonthlyBtn = styled.button`
    background-color: #4f87fe;
    border: 1px solid transparent;
    padding: 10px 30px;
    font-size: 1.1rem;
    font-weight: 600;
    float: right;
    border-radius: 5px;
    color: white;

    &:hover {
        cursor: pointer;
    }

`;

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

const DailySchedulerBody = (props) => {
    return (
        <Container>
            <CalendarHead>
                <span>{props.dateInfoState.year} Daily Scheduler</span>
                <span>{props.dateInfoState.month} 월</span>
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
                                <DateItem key={'date_item_idx' + index}
                                    className={(item === props.dateInfoState.today?.getDate()) && (props.dateInfoState.month === props.dateInfoState.today?.getMonth() + 1) && (props.dateInfoState.year === props.dateInfoState.today?.getFullYear()) ? 'today' : ''}
                                    onClick={(e) => props.schedulerItemControl().open(e, item)} >
                                    <DateInfoText>{item}</DateInfoText>
                                    <ScheduleContentBox>

                                    </ScheduleContentBox>
                                </DateItem>
                        )
                    })}
                </DateBody>
            </CalendarBody>

            <CalendarFooter>
                <MonthlyBtn onClick={(e) => props.monthlySchedulerControl().open(e)}>
                    월별 진행률
                </MonthlyBtn>
            </CalendarFooter>
        </Container>
    )
}

export default DailySchedulerBody;