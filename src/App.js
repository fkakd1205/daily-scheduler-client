import GlobalStyles from './GlobalStyles';
import React from "react";
import { BrowserRouter, Router, Route, Switch, Routes } from 'react-router-dom';

import DailySchedulerMain from './Component/DailySchedulerMain';

const App = () => {
  return (
    <>
      {/* Global Style */}
      <GlobalStyles />

      {/* Router */}
      <BrowserRouter>
        <Routes>
          {/* TODO::Header추가 */}
          <Route path="/" exact element={<DailySchedulerMain />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
