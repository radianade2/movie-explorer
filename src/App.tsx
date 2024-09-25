import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchResultsPage from "./pages/SearchResultsPage";
import Dashboard from "./pages/dashboard";
import MoviesPage from "./pages/MoviesPage";
import TVShowsPage from "./pages/TVShowsPage";
import MovieTable from "./components/ShowsTable";
import TVShowTable from "./components/TVShowTable";

// const MainContent: React.FC<{ selectedCategory: string }> = ({
//   selectedCategory,
// }) => {
//   const location = useLocation();

//   // Periksa jika URL adalah "/search", agar tidak merender Movies/TV Shows
//   const isSearchPage = location.pathname === "/search";

//   return (
//     <>
//       {!isSearchPage &&
//         (selectedCategory.includes("Movies") ? (
//           <MoviesPage selectedCategory={selectedCategory} />
//         ) : (
//           <TVShowsPage selectedCategory={selectedCategory} />
//         ))}
//     </>
//   );
// };

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Top Rated Movies");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Router>
      <Header onCategorySelect={handleCategorySelect} />
      
      {/* Gunakan Routes untuk mengelola navigasi halaman */}
      <Routes>
        <Route
          path="/"
          // element={<Dashboard selectedCategory={selectedCategory} />}
        />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/movies/top-rated" element={<MovieTable />} />
        {/* <Route path="/movies/now-playing" element={<MovieTable />} /> */}
        <Route path="/tv/top-rated" element={<TVShowTable />} />
        {/* <Route path="/tv/airing-today" element={<TVShowTable />} /> */}
      </Routes>

      {/* Footer diletakkan di bawah halaman */}
      <Footer />
    </Router>
  );
};

export default App;


// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";
// import MoviesPage from "./pages/MoviesPage";
// import TVShowsPage from "./pages/TVShowsPage";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import SearchResultsPage from "./pages/SearchResultsPage";
// import Dashboard from "./pages/Dashboard";

// const MainContent: React.FC<{ selectedCategory: string }> = ({
//   selectedCategory,
// }) => {
//   const location = useLocation();

//   // Jika URL adalah "/search", jangan tampilkan MoviesPage atau TVShowsPage
//   const isSearchPage = location.pathname === "/search";

//   return (
//     <>
//       {!isSearchPage &&
//         (selectedCategory.includes("Movies") ? (
//           <MoviesPage selectedCategory={selectedCategory} />
//         ) : (
//           <TVShowsPage selectedCategory={selectedCategory} />
//         ))}
//     </>
//   );
// };

// const App: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState("Now Playing Movies");
//   const navigate = useNavigate();

//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category);
//     // Mengubah rute berdasarkan kategori yang dipilih
//     if (category.includes("Movies")) {
//       navigate("/movies");
//     } else {
//       navigate("/tvshows");
//     }
//   };

//   return (
//     <div>
//       <Header onCategorySelect={handleCategorySelect} />

//       {/* Menampilkan konten utama berdasarkan rute */}
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/movies" element={<MoviesPage selectedCategory={selectedCategory} />} />
//         <Route path="/tvshows" element={<TVShowsPage selectedCategory={selectedCategory} />} />
//         <Route path="/search" element={<SearchResultsPage />} />
//       </Routes>

//       <Footer />
//     </div>
//   );
// };

// export default App;

// import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import SearchResultsPage from "./pages/SearchResultsPage";
// import Header from "./components/Header";
// import Footer from "./components/Footer";

// const App: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState("Top Rated Movies");

//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category);
//   };
//   return (
//     <Router>
//       <Header onCategorySelect={handleCategorySelect} />
//       <MainContent selectedCategory={selectedCategory} />
//       <Routes>
//         {/* Tambahkan route di sini */}
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/search" element={<SearchResultsPage />} />
//       </Routes>
//       <Footer/>
//     </Router>
//   );
// };

// export default App;
