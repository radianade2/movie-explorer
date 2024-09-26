import { useEffect, useState } from "react";
import "../components/ShowsTable.css";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchTopRatedMovies, fetchGenres } from "../api/apiConfig";
import axios from "axios";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { colors, Container } from "@mui/material";

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
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("genre_ids", {
    header: () => "Genre",
    cell: (info) =>
      info
        .getValue()
        .map((id) => genreMap[id])
        .join(", "),
  }),
  columnHelper.accessor("vote_average", {
    header: () => "Rating",
    cell: (info) => info.getValue(),
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
  const [page, setPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(1); // To track total pages from the API
  const [isLoading, setIsLoading] = useState(false);

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

        // Fetch the first page of top-rated movies
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
      setMovies(fetchedMovies.results); // Set only current page's results
      setTotalPages(fetchedMovies.total_pages); // Set total pages from API response
    } catch (error) {
      console.error("Error fetching movies", error);
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
    <Container
      style={{
        minHeight: "100vh",
        flexGrow: 1,
        padding: "50px",
        marginTop: "30px",
        marginBottom: "30px",
        alignContent: "center",
      }}
    >
      <div >
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
    </Container>
  );
};

export default MovieTable;
