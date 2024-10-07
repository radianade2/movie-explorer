import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchTopRatedMovies, fetchGenres } from "../api/apiConfig";
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

const columns = (
  genreMap: { [key: number]: string },
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

const MovieTableTopRated = () => {
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

        // Fetching halaman pertama dari top-rated movies
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
      const fetchedMovies = await fetchTopRatedMovies(page); // Pass page and limit 5 items
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

  const table = useReactTable({
    data: movies,
    columns: columns(genres),
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
      <h2>Top Rated Movies</h2>
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

export default MovieTableTopRated;
