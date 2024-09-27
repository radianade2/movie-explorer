import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResultsPage from './pages/resultPage'; // Make sure paths are correct
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import MovieTopRatedPage from './pages/MovieTopRatedPage';
import MovieNowPlayingPage from './pages/MovieNowPlayingPage';
import TVAiringTodayPage from './pages/TVAiringTodayPage';
import TVTopRatedPage from './pages/TVTopRatedPage';
import BookmarkPage from './pages/BookmarkPage';
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
        <Route path="/" element={<DashboardPage />} />
        <Route path="/search" element={<ResultsPage />} />
        <Route path="/movies/top-rated" element={<MovieTopRatedPage />} />
        <Route path="/movies/now-playing" element={<MovieNowPlayingPage />} />
        <Route path="/tv/top-rated" element={<TVTopRatedPage />} />
        <Route path="/tv/airing-today" element={<TVAiringTodayPage />} />
        <Route path="/bookmarks" element={<BookmarkPage />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
