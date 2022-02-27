import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
    ${reset};

    body{
        padding: 2% 5%;
        background-image: url(/assets/background.svg);
        background-size: 100%;
    }
`;

export default GlobalStyles;