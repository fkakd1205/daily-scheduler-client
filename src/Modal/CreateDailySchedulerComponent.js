import styled from 'styled-components';
import React, { useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

const Container = styled.div`
    min-height: 80vh;
    max-height: 80vh;
`;

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 1px solid #000;
    justify-content: space-between;
    width: 100%;
`;

const HeaderTitle = styled.span`
    font-size: 1.4rem;
    font-weight: 700;
    padding: 0 5%;
`;

const CloseBtn = styled.button`
    background: none;
    border:none;
    padding: 1.2% 3%;
    transition: 0.4s;

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

const BodyContainer = styled.div`
    /* background-color: blue; */
    padding: 2% 5%;
`;

const CreateBox = styled.div`
    padding: 2%;
    border-bottom: 1px solid #d7d7d7;
`;

const ScheduleCategoryBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 5%;
    place-items: center;
    padding: 2%;
`;

const CategoryBtn = styled.button`
    width: 100%;
    padding: 5%;
    border: none;
    background: linear-gradient(to bottom right, #bfe5ff, #73c9ff);
    border-radius: 5px;
    color: white;
    font-weight: 550;
    font-size: 1rem;

    &:hover {
        background: linear-gradient(to bottom right, #73c9ff, #bfe5ff);
    }
`;

const ScheduleContentBox = styled.div`
    display: grid;
    grid-template-columns: 80% 5%;
    padding: 5%;
    place-items: center;
`;

const ContentInput = styled.input`
    border: none;
    width: 80%;
    border-bottom: 0.5px solid #000;
    height: 3vw;
    font-size: 1rem;
    padding: 10px;
`;

const ContentAddBtn = styled.button`
    text-align: center;
    background: none;
    border: 1px solid #000;
    transition: 0.4s;
    background-color: white;
    border-radius: 50%;
    padding: 5px;
    align-content: center;

    &:hover{
        transform: scale(1.1);
        color: #56bfff;
        border: 1px solid #56bfff;
    }
    &:active{
        transition: 0.1s;
        transform: scale(1.05);
        color: #8fd3ff;
        border: 1px solid #8fd3ff;
    }
`;

const ViewBox = styled.div`

`;

const CreateDailySchedulerComponent = () => {
    return (
        <Container>
            <form>
                <HeaderContainer>
                    <HeaderTitle>등록</HeaderTitle>
                    <CloseBtn><CancelIcon fontSize="large"/></CloseBtn>
                </HeaderContainer>
                <BodyContainer>
                    <CreateBox>
                        <ScheduleCategoryBox>
                            {/* TODO :: DB Select */}
                            <CategoryBtn>Work</CategoryBtn>
                            <CategoryBtn>Study</CategoryBtn>
                            <CategoryBtn>Hobby</CategoryBtn>
                            <CategoryBtn>Anything</CategoryBtn>
                        </ScheduleCategoryBox>
                        <ScheduleContentBox>
                             <ContentInput type="text"></ContentInput>
                             <ContentAddBtn type="submit"><AddIcon /></ContentAddBtn>
                        </ScheduleContentBox>
                    </CreateBox>
                    <ViewBox>

                    </ViewBox>
                </BodyContainer>
            </form>
        </Container>
    )
}

export default CreateDailySchedulerComponent;