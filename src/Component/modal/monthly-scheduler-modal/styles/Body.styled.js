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

export const BodyWrapper = styled.div`
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
    }
`;

export const DataGroup = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 10% 10% 50% 15% 15%);
    column-gap: 5px;
    padding: 10px 20px;
    align-items: center;
    justify-items: center;
`;

export const DataText = styled.div`

    &.content {
        width: 100%;
        text-align: left;
    }

    &.check-box .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root.Mui-disabled {
        color: #8f979e;
    }
`;

export const CategorySelect = styled.select`
    border: none;
    background-color: transparent;

    &:focus {
        outline: none;
    }
`;

export const ProgressBox = styled.div`
    padding: 10px 20px;
    background-color: white;
`;