import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ResultsPage from './pages/resultPage'; // Make sure paths are correct
import MovieTable from "./components/MovieTable";
import MovieTable2 from "./components/MovieTable2";
import TVShowTable from "./components/TVShowTable";
import TVShowTable2 from "./components/TVShowTable2";
import Header from './components/Header';
import Footer from './components/Footer';
// import Dashboard from './pages/dashboard';
// import { Dashboard } from '@mui/icons-material';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Top Rated Movies");
  const handleCategorySelect = (category: string) => {
      setSelectedCategory(category);
  };

  return (
    <Router>
      <Header onCategorySelect={handleCategorySelect} />
      
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/search" element={<ResultsPage />} />
        <Route path="/movies/top-rated" element={<MovieTable />} />
        <Route path="/movies/now-playing" element={<MovieTable2 />} />
        <Route path="/tv/top-rated" element={<TVShowTable />} />
        <Route path="/tv/airing-today" element={<TVShowTable2 />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
