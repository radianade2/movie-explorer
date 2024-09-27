import React, { useEffect, useState } from "react";
import { fetchMoviesByIds, fetchTVShowsByIds } from "../api/apiConfig"; // Fungsi untuk fetch movie dan TV show berdasarkan id

// Tentukan tipe Movie dan TVShow untuk memastikan konsistensi data
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
}

interface TVShow {
  id: number;
  title: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
}

const BookmarkPage: React.FC = () => {
  const [bookmarkedMovies, setBookmarkedMovies] = useState<Movie[]>([]);
  const [bookmarkedTVShows, setBookmarkedTVShows] = useState<TVShow[]>([]);

  useEffect(() => {
    const fetchBookmarkedItems = async () => {
      // Ambil ID movie dan TV show dari localStorage
      const movieIds: number[] = JSON.parse(localStorage.getItem("bookmarkedMovies") || "[]");
      const tvShowIds: number[] = JSON.parse(localStorage.getItem("bookmarkedTVShows") || "[]");

      // Fetch movie dan TV show berdasarkan ID
      if (movieIds.length > 0) {
        const fetchedMovies = await fetchMoviesByIds(movieIds);
        setBookmarkedMovies(fetchedMovies);
      }

      if (tvShowIds.length > 0) {
        const fetchedTVShows = await fetchTVShowsByIds(tvShowIds);
        setBookmarkedTVShows(fetchedTVShows);
      }
    };

    fetchBookmarkedItems();
  }, []);

  return (
    <div>
      <h2>Your Bookmarked Movies & TV Shows</h2>

      {/* Render Bookmarked Movies */}
      <div>
        <h3>Bookmarked Movies</h3>
        {bookmarkedMovies.length === 0 ? (
          <p>No movies bookmarked yet.</p>
        ) : (
          <div className="bookmarked-movies-list">
            {bookmarkedMovies.map((movie) => (
              <div key={movie.id}>
                <h4>{movie.title}</h4>
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                {/* Render other movie details like genre, vote_average, etc */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render Bookmarked TV Shows */}
      <div>
        <h3>Bookmarked TV Shows</h3>
        {bookmarkedTVShows.length === 0 ? (
          <p>No TV shows bookmarked yet.</p>
        ) : (
          <div className="bookmarked-tvshows-list">
            {bookmarkedTVShows.map((tvShow) => (
              <div key={tvShow.id}>
                <h4>{tvShow.title}</h4>
                <img src={`https://image.tmdb.org/t/p/w200${tvShow.poster_path}`} alt={tvShow.title} />
                {/* Render other TV show details like genre, vote_average, etc */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;
