import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import TurboSniperDashboard from './pages/TurboSniperDashboard';
import FlashSniperTradingInterface from './pages/FlashSniperTradingInterface';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<TurboSniperDashboard />} /> */}
        <Route path="/" element={<FlashSniperTradingInterface />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;