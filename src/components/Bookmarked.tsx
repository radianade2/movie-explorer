// src/components/Bookmarked.tsx
import { useEffect, useState } from "react";
import "../components/Bookmarked.css";
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
import axios from "axios";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

interface User {
  poster_path: string;
  title: string;
  genre_ids: number[];
  vote_average: number;
  like: number;
  id: number;
}

const columnHelper = createColumnHelper<User>();

const columns = (genreMap: { [key: number]: string }, handleLike: (movieId: number) => void) => [
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
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("genre_ids", {
    header: () => "Genre",
    cell: (info) => {
      const genres = info.getValue()
        .map((id) => genreMap[id])
        .filter(Boolean); // Filter out any undefined values

      return genres.length > 0 ? genres.join(", ") : "Unknown"; // Show 'Unknown' if no genres
    },
  }),
  columnHelper.accessor("vote_average", {
    header: () => "Rating",
    cell: (info) => {
      const rating = info.getValue();
      return rating.toFixed(1); // Format to 1 decimal place
    },
  }),
  columnHelper.accessor("like", {
    header: () => "Like",
    cell: (info) => {
      const movie = info.row.original;
      return (
        <div>
          <ThumbUpIcon onClick={() => handleLike(movie.id)} />
          <span>{movie.like}</span>
        </div>
      );
    },
  }),
];

const MovieTable = () => {
  const [movies, setMovies] = useState<User[]>([]);
  const [genres, setGenres] = useState<{ [key: number]: string }>({});
  const [category, setCategory] = useState("top-rated-movies");
  const [page, setPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(1); // To track total pages from the API
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const fetchedGenres = await fetchGenres();
        const genreMap = fetchedGenres.reduce(
          (acc: { [key: number]: string }, genre: { id: number; name: string }) => {
            acc[genre.id] = genre.name;
            return acc;
          },
          {}
        );
        setGenres(genreMap);

        // Fetch movies or TV shows based on the selected category
        await fetchMoviesOrShows(category, page);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [category, page]);

  const fetchMoviesOrShows = async (category: string, page: number) => {
    try {
      let fetchedData;
      switch (category) {
        case "top-rated-movies":
          fetchedData = await fetchTopRatedMovies(page);
          break;
        case "now-playing-movies":
          fetchedData = await fetchNowPlayingMovies(page);
          break;
        case "top-rated-tv":
          fetchedData = await fetchTopRatedTV(page);
          break;
        case "airing-today-tv":
          fetchedData = await fetchAiringTodayTVShows(page);
          break;
        default:
          fetchedData = await fetchTopRatedMovies(page);
      }
      setMovies(fetchedData.results);
      setTotalPages(fetchedData.total_pages);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleLike = async (movieId: number) => {
    try {
      const response = await axios.post(`/api/likes/${movieId}`);
      const updatedLikes = response.data.like_count;
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId ? { ...movie, like: updatedLikes } : movie
        )
      );
    } catch (error) {
      console.error("Error liking the movie", error);
    }
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
      <h2> Movies and TV Shows </h2>

      <div style={{ marginBottom:'12px'}}>
        <button onClick={() => setCategory("top-rated-movies")}>Top Rated Movies</button>
        <button onClick={() => setCategory("now-playing-movies")}>Now Playing Movies</button>
        <button onClick={() => setCategory("top-rated-tv")}>Top Rated TV Shows</button>
        <button onClick={() => setCategory("airing-today-tv")}>Airing Today TV Shows</button>
      </div>

      {isLoading && <p>Loading...</p>}
      <table className="users-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="users-table-cell">
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
          {"<"}
        </button>
        <span>{`Page ${page} of ${totalPages}`}</span>
        <button onClick={nextPage} disabled={page === totalPages}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export default MovieTable;
