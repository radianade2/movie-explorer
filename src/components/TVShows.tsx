// src/components/TVShows.tsx
import { useEffect, useState } from "react";
import "../components/ShowsTable.css";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { fetchAiringTodayTVShows, fetchTopRatedTV, fetchGenres } from "../api/apiConfig";
import axios from "axios";

export type TVShow = {
  poster_path: string;
  title: string;
  genre_ids: number[];
  vote_average: number;
  like: number;
  id: number; // Assuming you have a TV show ID from the API
};

const columnHelper = createColumnHelper<TVShow>();

const columns = (genreMap: { [key: number]: string }, handleLike: (tvShowId: number) => void) => [
  columnHelper.accessor("poster_path", { 
    header: () => "Poster", 
    cell: (info) => <img src={`https://image.tmdb.org/t/p/w200${info.getValue()}`} alt={info.row.original.title} style={{ height: '100px' }} /> 
  }),
  columnHelper.accessor("title", { header: () => "Title", cell: (info) => info.getValue() }),
  columnHelper.accessor("genre_ids", {
    header: () => "Genre",
    cell: (info) => {
      const genres = info.getValue()
        .map((id) => genreMap[id]) // Map genre IDs to names
        .filter((genre) => genre) // Remove undefined genres
        .join(", "); // Join the genres with a comma
      return genres || "Unknown"; // Display "Unknown" if no genres are found
    }
  }),
  
  columnHelper.accessor("vote_average", { header: () => "Rating", cell: (info) => info.getValue() }),
  columnHelper.accessor("like", {
    header: () => "Like",
    cell: (info) => {
      const tvShow = info.row.original;
      return (
        <div>
          <button onClick={() => handleLike(tvShow.id)}>Like</button>
          <span>{tvShow.like}</span>
        </div>
      );
    },
  }),
];

const ShowsTable = () => {
  const [airingTodayTVShows, setAiringTodayTVShows] = useState<TVShow[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<{ [key: number]: string }>({});
  const [visibleAiringTodayCount, setVisibleAiringTodayCount] = useState(5);
  const [visibleTopRatedCount, setVisibleTopRatedCount] = useState(5);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const fetchedAiringTodayTVShows = await fetchAiringTodayTVShows();
        const fetchedTopRatedMovies = await fetchTopRatedTV();
        const fetchedGenres = await fetchGenres();
        const genreMap = fetchedGenres.reduce((acc: { [key: number]: string }, genre: { id: number, name: string }) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        setAiringTodayTVShows(fetchedAiringTodayTVShows);
        setTopRatedTVShows(fetchedTopRatedMovies);
        setGenres(genreMap);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchAllData();
  }, []);

  const handleLike = async (tvShowId: number) => {
    try {
      const response = await axios.post(`/api/likes/${tvShowId}`);
      const updatedLikes = response.data.like_count;
      setAiringTodayTVShows((prevTVShows) =>
        prevTVShows.map((tvShow) =>
          tvShow.id === tvShowId ? { ...tvShow, like: updatedLikes } : tvShow
        )
      );
    } catch (error) {
      console.error("Error liking the TV show", error);
    }
  };

  const airingTodayTable = useReactTable({ 
    data: airingTodayTVShows.slice(0, visibleAiringTodayCount), 
    columns: columns(genres, handleLike), 
    getCoreRowModel: getCoreRowModel() 
  });

  const topRatedTable = useReactTable({ 
    data: topRatedTVShows.slice(0, visibleTopRatedCount), 
    columns: columns(genres, handleLike), 
    getCoreRowModel: getCoreRowModel() 
  });

  return (
    <div>
      <h2>Airing Today TV Shows</h2>
      <table className="users-table">
        <thead>
          {airingTodayTable.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="users-table-cell">{flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {airingTodayTable.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="users-table-cell">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {visibleAiringTodayCount < airingTodayTVShows.length && (
        <button onClick={() => setVisibleAiringTodayCount(prev => Math.min(prev + 5, airingTodayTVShows.length))}>
          Load More
        </button>
      )}

      <h2>Top Rated TV Shows</h2>
      <table className="users-table">
        <thead>
          {topRatedTable.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="users-table-cell">{flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {topRatedTable.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="users-table-cell">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {visibleTopRatedCount < topRatedTVShows.length && (
        <button onClick={() => setVisibleTopRatedCount(prev => Math.min(prev + 5, topRatedTVShows.length))}>
          Load More
        </button>
      )}
    </div>
  );
};

export default ShowsTable;
