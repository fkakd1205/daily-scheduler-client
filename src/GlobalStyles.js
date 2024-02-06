import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
    ${reset};

    body {
        position: relative;
        width: 100%;
        height: 100%;

        .scheduler-body {
            height: 100vh;
            background-image: url(/assets/background.svg);
            background-size: 100%;
            position: absolute;
            object-fit: cover;
            width: 100%;
            border:1px solid #f1f1f1;
            overflow: auto;
        }
    }
`;

export default GlobalStyles;