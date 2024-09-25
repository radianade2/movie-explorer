import React, { useState, useEffect } from 'react';
import { fetchTopRatedMovies, fetchNowPlayingMovies, fetchGenres } from '../api/apiConfig'; // API untuk Movies
import ShowsTable from '../components/ShowsTable';
import MovieTable from '../components/Movies';

interface Props {
  selectedCategory: string;
}

const MoviesPage: React.FC<Props> = ({ selectedCategory }) => {
  // const [topRatedMovies, setTopRatedMovies] = useState([]);
  // const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
      //   const [topRatedMoviesData, nowPlayingMoviesData, genresData] = await Promise.all([
      //     fetchTopRatedMovies(),
      //     fetchNowPlayingMovies(),
      //     fetchGenres(),
      //   ]);

      //   setTopRatedMovies(topRatedMoviesData.slice(0, 5));
      //   setNowPlayingMovies(nowPlayingMoviesData.slice(0, 5));

      const moviesData =
      selectedCategory === 'Top Rated Movies'
        ? await fetchTopRatedMovies()
        : await fetchNowPlayingMovies();

      const genresData = await fetchGenres();

      setMovies(moviesData.slice(0, 5));
        setGenres(genresData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchMoviesData();
  }, [selectedCategory]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading movies data</div>;

  return (
    <div >
      {/* <ShowsTable title="Top Rated Movies" shows={topRatedMovies} genres={genres} />
      <ShowsTable title="Now Playing Movies" shows={nowPlayingMovies} genres={genres} /> */}
      <ShowsTable title={selectedCategory} shows={movies} genres={genres}/>
    </div>
  );
};

export default MoviesPage;

// import { useState } from "react";
// import MovieTable from "../components/Movies";
// import Header from "../components/Header";

// const MoviePage: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string>("Now Playing Movies");

//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category);
//   };

//   return (
//     <div>
//       <Header onCategorySelect={handleCategorySelect} />
//       <div style={{ marginTop: "100px" }}> {/* Add margin to prevent overlap with AppBar */}
//         <MovieTable selectedCategory={selectedCategory} />
//       </div>
//     </div>
//   );
// };

// export default MoviePage;