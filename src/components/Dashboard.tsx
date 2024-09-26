import React, { useEffect, useState } from "react";
import "../components/Dashboard.css"; // Mengimpor file CSS
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  fetchTopRatedMovies,
  fetchNowPlayingMovies,
  fetchAiringTodayTVShows,
  fetchTopRatedTV,
  fetchGenres,
} from "../api/apiConfig";
import { Tabs, Tab, IconButton } from "@mui/material"; // Import Tabs and Tab components
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

interface Movie {
  poster_path: string;
  title: string;
  genre_ids: number[];
  vote_average: number;
  like: number;
  id: number;
  isBookmarked: boolean;
}

const columnHelper = createColumnHelper<Movie>();

// Function to create table columns
const columns = (
  genreMap: { [key: number]: string },
  handleLike: (movieId: number) => void,
  handleBookmark: (movieId: number) => void
) => [
  columnHelper.accessor("poster_path", {
    header: "Poster",
    cell: (info) => (
      <img
        src={`https://image.tmdb.org/t/p/w200${info.getValue()}`}
        alt={info.row.original.title}
        style={{ height: "100px", borderRadius: "8px" }}
      />
    ),
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => <span style={{ fontWeight: "bold" }}>{info.getValue()}</span>,
  }),
  columnHelper.accessor("genre_ids", {
    header: "Genre",
    cell: (info) => {
      const genres = info.getValue().map((id) => genreMap[id]).filter(Boolean);
      return genres.length > 0 ? genres.join(", ") : "Unknown";
    },
  }),
  columnHelper.accessor("vote_average", {
    header: "Rating",
    cell: (info) => info.getValue().toFixed(1),
  }),
  columnHelper.accessor("like", {
    header: "Like",
    cell: (info) => {
      const movie = info.row.original;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => handleLike(movie.id)}>
            <ThumbUpIcon />
          </IconButton>
          <span>{movie.like}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("isBookmarked", {
    header: "Bookmark",
    cell: (info) => {
      const movie = info.row.original;
      return (
        <IconButton onClick={() => handleBookmark(movie.id)}>
          {movie.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      );
    },
  }),
];

const MovieTable = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ [key: number]: string }>({});
  const [category, setCategory] = useState("top-rated-movies");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Fetch genres
        const fetchedGenres = await fetchGenres();
        const genreMap = fetchedGenres.reduce(
          (acc: { [key: number]: string }, genre: { id: number; name: string }) => {
            acc[genre.id] = genre.name;
            return acc;
          },
          {}
        );
        setGenres(genreMap);
    
        // Fetch movies or TV shows
        const savedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
    
        const fetchedData = await fetchMoviesOrShows(category, page); // Assuming fetchMoviesOrShows returns an object
        const fetchedMovies = fetchedData.results; // Extract the array of movies
        const totalPages = fetchedData.total_pages; // Extract total pages for pagination
    
        const moviesWithLikes = fetchedMovies.map((movie: Movie) => ({
          ...movie,
          like: savedLikes[movie.id] !== undefined ? savedLikes[movie.id] : movie.like || 0, // Pastikan nilai awalnya angka atau boolean
        }));
    
        setMovies(moviesWithLikes); // Set the actual movies array
        setTotalPages(totalPages); // Set total pages for pagination
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [category, page]);

  const fetchMoviesOrShows = async (category: string, page: number) => {
    switch (category) {
      case "top-rated-movies":
        return await fetchTopRatedMovies(page);
      case "now-playing-movies":
        return await fetchNowPlayingMovies(page);
      case "top-rated-tv":
        return await fetchTopRatedTV(page);
      case "airing-today-tv":
        return await fetchAiringTodayTVShows(page);
      default:
        return await fetchTopRatedMovies(page);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    switch (newValue) {
      case 0:
        setCategory("top-rated-movies");
        break;
      case 1:
        setCategory("now-playing-movies");
        break;
      case 2:
        setCategory("top-rated-tv");
        break;
      case 3:
        setCategory("airing-today-tv");
        break;
      default:
        setCategory("top-rated-movies");
    }
  };

  const handleLike = (movieId: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, like: movie.like + 1 }
          : movie
      )
    );

    // Update likes in localStorage
    const savedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
    savedLikes[movieId] = (savedLikes[movieId] || 0) + 1;
    localStorage.setItem("likes", JSON.stringify(savedLikes));
  };

  const handleBookmark = (movieId: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  const table = useReactTable({
    data: movies,
    columns: columns(genres, handleLike, handleBookmark),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  return (
    <div className="movie-table-container">
      <h2 className="table-header">Movies and TV Shows</h2>

      {/* Material UI Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="movie and tv show categories"
        variant="scrollable"
        scrollButtons="auto"
        centered
        sx={{
          ".MuiTab-root": { fontSize: "0.8rem", color: "#9e9e9e" },
          ".Mui-selected": { color: "#FECE04", fontWeight: "bold" },
          ".MuiTabs-indicator": { backgroundColor: "#FECE04" },
          mb: 2,
        }}
      >
        <Tab label="Top Rated Movies" />
        <Tab label="Now Playing Movies" />
        <Tab label="Top Rated TV Shows" />
        <Tab label="Airing Today TV Shows" />
      </Tabs>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="users-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination-controls">
        <button onClick={prevPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieTable;
