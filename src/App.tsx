// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
         {/* Tambahkan route di sini */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;