import styled from 'styled-components';

export const Container = styled.div`
    padding: 2% 5%;
`;

export const CalendarHead = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 25% 50% 25%);
    justify-content: space-between;
    justify-items: center;
    font-weight: 600;
    font-size: 1.4rem;
    padding: 5px;
    height: 4vw;
    align-items: center;

    @media screen and (max-width: 992px){
        grid-template-columns: repeat(3, 1fr);
        font-size: 1.2rem;
        height: auto;
    }
`;

export const CalendarFooter = styled.div`
    padding: 10px;

    button {
        background-color: #4f87fe;
        border: 1px solid transparent;
        padding: 10px 30px;
        font-size: 1.1rem;
        font-weight: 600;
        float: right;
        border-radius: 5px;
        color: white;

        :hover {
            cursor: pointer;
        }
        @media screen and (max-width: 992px) {
            font-size: 12px;
        }
    }

`;

export const MonthControlBtn = styled.button`
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

export const DayInfo = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    column-gap: 10px;
    row-gap: 10px;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 2px solid #7c7c7c;
    margin-bottom: 1%;
`;

export const DateBody = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    column-gap: 10px;
    row-gap: 10px;
    justify-items: stretch;
`;

export const CalendarBody = styled.div`
    background-color: #ffffff;
    box-shadow: 1px 1px 15px #a9b3d599;
    padding: 20px;
    border-radius: 15px;
`;

export const DateItem = styled.div`
    padding: 10px;
    background-color: white;
    box-shadow: 1px 1px 15px #a9b3d599;
    transition: 0.3s;
    border-radius: 3px;
    min-height: 10vh;
    max-height: 10vh;

    &.other-month {
        background-color: #e4e4e4aa;
    }

    &.today {
        font-weight: 700;
        background-color: #b0e0ff;
        box-shadow: 2px 2px 15px #b0e0ff;

    }

    :hover{
        background-color: #8fd3ff;
        font-weight: 700;
        color: white;
        cursor: pointer;
    }


    @media screen and (max-width: 992px){
        font-size: 12px;
        min-height: 6vh;
        max-height: 6vh;
    }
    
    @media screen and (max-width: 576px){
        min-height: auto;
        min-height: auto;
    }
`;