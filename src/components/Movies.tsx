import React, { useEffect, useState } from "react";
import "../components/ShowsTable.css";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { fetchNowPlayingMovies, fetchTopRatedMovies, fetchGenres } from "../api/apiConfig";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axios from "axios";

export type User = {
  poster_path: string;
  title: string;
  genre_ids: number[];
  vote_average: number;
  like: number;
  id: number;
};

const columnHelper = createColumnHelper<User>();

const columns = (genreMap: { [key: number]: string }, handleLike: (movieId: number) => void) => [
  columnHelper.accessor("poster_path", {
    header: () => "Poster",
    cell: (info) => <img src={`https://image.tmdb.org/t/p/w200${info.getValue()}`} alt={info.row.original.title} style={{ height: '100px' }} />
  }),
  columnHelper.accessor("title", { header: () => "Title", cell: (info) => info.getValue() }),
  columnHelper.accessor("genre_ids", {
    header: () => "Genre",
    cell: (info) => info.getValue().map((id) => genreMap[id]).join(", ")
  }),
  columnHelper.accessor("vote_average", { header: () => "Rating", cell: (info) => info.getValue() }),
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

interface MovieTableProps {
  selectedCategory: string;
}

const MovieTable: React.FC<MovieTableProps> = ({ selectedCategory }) => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<User[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<User[]>([]);
  const [genres, setGenres] = useState<{ [key: number]: string }>({});
  const [visibleNowPlayingCount, setVisibleNowPlayingCount] = useState(5);
  const [visibleTopRatedCount, setVisibleTopRatedCount] = useState(5);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const fetchedNowPlayingMovies = await fetchNowPlayingMovies();
        const fetchedTopRatedMovies = await fetchTopRatedMovies();
        const fetchedGenres = await fetchGenres();
        const genreMap = fetchedGenres.reduce((acc: { [key: number]: string }, genre: { id: number, name: string }) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        setNowPlayingMovies(fetchedNowPlayingMovies);
        setTopRatedMovies(fetchedTopRatedMovies);
        setGenres(genreMap);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchAllData();
  }, []);

  const handleLike = async (movieId: number) => {
    try {
      const response = await axios.post(`/api/likes/${movieId}`);
      const updatedLikes = response.data.like_count;
      setNowPlayingMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId ? { ...movie, like: updatedLikes } : movie
        )
      );
    } catch (error) {
      console.error("Error liking the movie", error);
    }
  };

  // Choose the correct data based on selectedCategory
  const moviesToDisplay = selectedCategory === "Now Playing Movies" ? nowPlayingMovies : topRatedMovies;
  const table = useReactTable({
    data: moviesToDisplay.slice(0, selectedCategory === "Now Playing Movies" ? visibleNowPlayingCount : visibleTopRatedCount),
    columns: columns(genres, handleLike),
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div>
      <h2>{selectedCategory}</h2>
      <table className="users-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="users-table-cell">{flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="users-table-cell">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCategory === "Now Playing Movies" && visibleNowPlayingCount < nowPlayingMovies.length && (
        <button onClick={() => setVisibleNowPlayingCount(prev => Math.min(prev + 5, nowPlayingMovies.length))}>
          Load More
        </button>
      )}
      {selectedCategory === "Top Rated Movies" && visibleTopRatedCount < topRatedMovies.length && (
        <button onClick={() => setVisibleTopRatedCount(prev => Math.min(prev + 5, topRatedMovies.length))}>
          Load More
        </button>
      )}
    </div>
  );
};

export default MovieTable;
