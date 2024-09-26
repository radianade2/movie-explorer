import { useEffect, useState } from "react";
// import "../components/ShowsTable.css";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchGenres, fetchNowPlayingMovies } from "../api/apiConfig";
import axios from "axios";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import { colors } from "@mui/material";

interface User {
  poster_path: string;
  title: string;
  genre_ids: number[];
  vote_average: number;
  like: number;
  id: number;
}

const columnHelper = createColumnHelper<User>();

const columns = (
  genreMap: { [key: number]: string },
  handleLike: (movieId: number) => void
) => [
  columnHelper.accessor("poster_path", {
    header: () => "Poster",
    cell: (info) => (
      <img
        src={`https://image.tmdb.org/t/p/w200${info.getValue()}`}
        alt={info.row.original.title}
        style={{ height: "100px" }}
      />
    ),
  }),
  columnHelper.accessor("title", {
    header: () => "Title",
    cell: (info) => info.getValue() || "unknown",
  }),
  columnHelper.accessor("genre_ids", {
    header: () => "Genre",
    cell: (info) => {
      const genres = info
        .getValue()
        .map((id) => genreMap[id])
        .filter(Boolean);

      return genres.length > 0 ? genres.join(", ") : "Unknown";
    },
  }),
  columnHelper.accessor("vote_average", {
    header: () => "Rating",
    cell: (info) => {
      const rating = info.getValue();
      return rating.toFixed(1);
    },
  }),
  columnHelper.accessor("like", {
    header: () => "Like",
    cell: (info) => {
      const movie = info.row.original;
      return (
        <div>
          <ThumbUpIcon />
          <span>{movie.like}</span>
        </div>
      );
    },
  }),
];

const MovieTableNowPlaying = () => {
  const [movies, setMovies] = useState<User[]>([]);
  const [genres, setGenres] = useState<{ [key: number]: string }>({});
  const [page, setPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(1); // To track total pages from the API
  const [isLoading, setIsLoading] = useState(false);

  // Helper function untuk load likes dari localStorage
  const loadLikesFromLocalStorage = () => {
    const savedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
    return savedLikes;
  };

  // Helper function untuk menyimpan likes ke localStorage
  const saveLikesToLocalStorage = (likes: { [key: number]: number }) => {
    localStorage.setItem("likes", JSON.stringify(likes));
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const fetchedGenres = await fetchGenres();
        const genreMap = fetchedGenres.reduce(
          (
            acc: { [key: number]: string },
            genre: { id: number; name: string }
          ) => {
            acc[genre.id] = genre.name;
            return acc;
          },
          {}
        );
        setGenres(genreMap);

        // Fetching halaman pertama dari now-playing movies
        await fetchMovies(page);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [page]);

  const fetchMovies = async (page: number) => {
    try {
      const fetchedMovies = await fetchNowPlayingMovies(page); // Pass page and limit 5 items
      const savedLikes = loadLikesFromLocalStorage();

      // Update movies dengan likes dari localStorage
      const moviesWithLikes = fetchedMovies.results.map((movie: User) => ({
        ...movie,
        like: savedLikes[movie.id] !== undefined ? savedLikes[movie.id] : 0, // Menggunakan like yang sudah ada atau default ke 0
      }));

      setMovies(moviesWithLikes); 
      setTotalPages(fetchedMovies.total_pages); // Set total pages dari API response
    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };

  const handleLike = (movieId: number) => {
    // Update like count dari movie
    const updatedMovies = movies.map((movie) =>
      movie.id === movieId ? { ...movie, like: movie.like ? 0 : 1 } : movie
    );
    setMovies(updatedMovies);

    // Update localStorage
    const savedLikes = loadLikesFromLocalStorage();
    savedLikes[movieId] = updatedMovies.find((movie) => movie.id === movieId)?.like || 0;
    saveLikesToLocalStorage(savedLikes);
  };

  const table = useReactTable({
    data: movies,
    columns: columns(genres, handleLike),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Enable manual pagination
    pageCount: totalPages,
  });

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      <h2>Now Playing Movies</h2>
      {isLoading && <p>Loading...</p>}
      <table className="users-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="users-table-cell">
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
                <td key={cell.id} className="users-table-cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={page === 1}>
          {" "}
          {"<"}{" "}
        </button>
        <span>{`Page ${page} of ${totalPages}`}</span>
        <button onClick={nextPage} disabled={page === totalPages}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export default MovieTableNowPlaying;
