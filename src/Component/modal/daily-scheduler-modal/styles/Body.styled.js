import styled from "styled-components";

export const Container = styled.div`
`;

export const HeaderContainer = styled.div`
    padding: 10px 20px;
    border-bottom: 1px solid #000;

    .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center
    }

    .modal-title {
        font-size: 1.3rem;
        font-weight: 700;
        @media only screen and (max-width:576px){
            font-size: 16px;
        }
    }

    .modal-close-btn {
        color: #5c5c7e;
        &:hover {
            color: #80808b;
        }
    }
`;

export const BodyContainer = styled.div`
    padding: 2% 5%;
`;

export const CreateBox = styled.div`
    padding: 1%;
    border-bottom: 1px solid #d7d7d7;
`;

export const ScheduleCategoryBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 4%;
    place-items: center;
    padding: 1%;

    & .schedule-category-btn-active{
        background: #94b5ca;
    }
`;

export const CategoryBtn = styled.button`
    width: 100%;
    padding: 5%;
    border: none;
    background: linear-gradient(to bottom right, #d7dbff, #73c9ff);
    border-radius: 5px;
    color: white;
    font-weight: 550;
    font-size: 1rem;
    transition: 0.2s;

    &:hover {
        opacity: 0.7;
    }
`;

export const ScheduleContentBox = styled.div`
    display: grid;
    grid-template-columns: 90% 10%;
    padding: 3% 10%;
    place-items: center;
`;

export const ContentInput = styled.input`
    border: none;
    width: 90%;
    border-bottom: 0.5px solid #000;
    height: 3vw;
    font-size: 1rem;
    padding: 7px;
    transition: 0.3s;

    &:focus {
        outline: none;
    }
`;

export const ContentAddBtn = styled.button`
    text-align: center;
    background: none;
    border: none;
    transition: 0.4s;
    align-content: center;
    color: #595959;

    &:hover{
        transform: scale(1.1);
        color: #56bfff;
    }
    &:active{
        transition: 0.1s;
        transform: scale(1.05);
        color: #8fd3ff;
    }
`;

export const ViewBox = styled.div`
    padding : 3% 4%;
    padding-bottom: 7%;
`;

export const BodyWrapper = styled.div`
    padding-bottom: 5%;
    background-color: #eeeeeeb3;
    border-radius: 5px;
    min-height: 50vh;
    max-height: 50vh;
    overflow: auto;
    font-size: 14px;

    .fixed-header {
        position: sticky;
        top: -1px;
        background: #d5dae9;
        z-index:10;
        border-bottom: none;
    }
`;

export const DataGroupLi = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 10% 10% 50% 10% 10% 10%);
    column-gap: 5px;
    padding: 10px 20px;
    align-items: center;
    justify-items: center;
    border-bottom: 2px solid #d5dae94f;
`;

export const DeleteBtn = styled.div`
    color: #595959;

    &:hover{
        cursor: pointer;
        transition: 0.1s;
        transform: scale(1.1);
        color: red;
    }
`;

export const DataText = styled.div`
`;

export const DataTextInput = styled.input`
    border: 1px solid transparent;
    background-color: transparent;
    width: 80%;
    padding: 5px;
    transition: 0.2s;
    
    &:focus{
        outline: none;
        border-bottom: 1px solid #000;
    }
`;

export const EditControl = styled.button`
    padding: 1% 4%;
    float: right;
    margin: 5px;
    border: none;
    background-color: #bdc7e7;
    font-size: 1rem;
    font-weight: 500;
`;

export const CategorySelect = styled.select`
    border: none;
    background-color: transparent;

    &:focus {
        outline: none;
    }
`;