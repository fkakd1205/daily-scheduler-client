import styled from 'styled-components';
import React, { useState } from "react";

const Container = styled.div`
`;

const CalendarHead = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 1.2rem;
    padding: 5px;
    height: 8vw;
    align-items: center;
`;

const CalendarBody = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    column-gap: 10px;
    row-gap: 10px;
    justify-items: stretch;
    background-color: #ffffffaa;
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
    }
`;

const OtherMonthItem = styled.div`
    padding: 10px;
    background-color: #e4e4e4;
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

const DailySchedulerBody = (props) => {

    return (
        <>
            <Container>
                <CalendarHead>
                    <span>{props.month} 월</span>
                    <span> Daily Scheduler</span>
                    <div>
                        <span>&lt;- -&gt;</span>
                    </div>
                </CalendarHead>
                <CalendarBody>
                    {props.totalDate?.map((item, index) => {
                        if (index < props.prevMonthLastDate || index >= props.nextMonthStartDate) {
                            return (
                                <OtherMonthItem key={'date_item_idx' + index} index={index}>
                                    <DateInfoText>{item}</DateInfoText>
                                    <ScheduleContentBox>
                                    </ScheduleContentBox>
                                </OtherMonthItem>
                            )
                        }
                        else {
                            return (
                                <DateItem key={'date_item_idx' + index} index={index}>
                                    <DateInfoText>{item}</DateInfoText>
                                    <ScheduleContentBox>

                                    </ScheduleContentBox>
                                </DateItem>
                            )
                        }
                    })}
                </CalendarBody>
            </Container>
        </>
    )
}

export default DailySchedulerBody;