import GlobalStyles from './GlobalStyles';
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';

import DailySchedulerMain from './component/DailySchedulerMain';

const theme = unstable_createMuiStrictModeTheme();

const App = () => {
  return (
    <>
      {/* Global Style */}
      <GlobalStyles />

      <ThemeProvider theme={theme}>
        {/* Router */}
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<DailySchedulerMain />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
