import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ResultsPage from './pages/resultPage'; // Make sure paths are correct

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/search" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
