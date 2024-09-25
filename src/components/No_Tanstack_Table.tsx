// Ini untuk tabel yang ga pakai tanstack
// src/components/ShowsTable
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Pagination,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkIcon from "@mui/icons-material/Bookmark"; // Import BookmarkIcon
import {
  fetchTopRatedMovies,
  fetchNowPlayingMovies,
  fetchGenres,
  fetchTopRatedTV,
  fetchAiringTodayTVShows,
} from '../api/apiConfig';

interface Show {
  id: number;
  title: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

const ShowsTable = ({ title, fetchShows, genres }: { title: string; fetchShows: (page: number) => Promise<any>; genres: Genre[] }) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [likeCount, setLikeCount] = useState<{ [key: number]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleLike = (id: number) => {
    setLikeCount((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const getGenreNames = (genreIds: number[]) => {
    const genreNames = genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean);
    return genreNames.length > 0 ? genreNames.join(', ') : 'Unknown';
  };

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    await loadShows(value);
  };

  const loadShows = async (page: number) => {
    setIsLoading(true);
    try {
      const { results, total_pages } = await fetchShows(page);
      setShows(results);
      setTotalPages(total_pages);
    } catch (error) {
      console.error('Error fetching shows:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShows(currentPage);
  }, [currentPage]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <TableContainer component={Paper} sx={{ marginBottom: 4, backgroundColor:"#F5F5F7" }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        {title || 'Unknown Title'}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '15%', textAlign: 'center' }}>Poster</TableCell>
            <TableCell sx={{ width: '30%', textAlign: 'center' }}>Title</TableCell>
            <TableCell sx={{ width: '25%', textAlign: 'center' }}>Genre</TableCell>
            <TableCell sx={{ width: '10%', textAlign: 'center' }}>Rating</TableCell>
            <TableCell sx={{ width: '10%', textAlign: 'center' }}>Like</TableCell>
            <TableCell sx={{ width: '10%', textAlign: 'center' }}>Bookmark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shows.map((show) => (
            <TableRow key={show.id}>
              <TableCell sx={{ textAlign: 'center' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                  alt={show.title || 'Unknown Title'}
                  style={{ width: '50px', height: '75px' }}
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{show.title || 'Unknown Title'}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{getGenreNames(show.genre_ids) || 'Unknown'}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{show.vote_average.toFixed(1)} </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <IconButton onClick={() => handleLike(show.id)}>
                  <ThumbUpIcon />
                </IconButton>
                {likeCount[show.id] || 0}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <IconButton onClick={() => handleBookmark(show.id)}>
                  <BookmarkIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        color="primary"
        sx={{ margin: 2 }}
      />
    </TableContainer>
  );
};

const MovieAndTVTables = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchGenresData = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchGenresData();
  }, []);

  if (isLoading) return <div>Loading genres...</div>;
  if (isError) return <div>Error loading genres</div>;

  return (
    <div>
      <ShowsTable title="Top Rated Movies" fetchShows={fetchTopRatedMovies} genres={genres} />
      <ShowsTable title="Now Playing Movies" fetchShows={fetchNowPlayingMovies} genres={genres} />
      <ShowsTable title="Top Rated TV Shows" fetchShows={fetchTopRatedTV} genres={genres} />
      <ShowsTable title="Airing Today TV Shows" fetchShows={fetchAiringTodayTVShows} genres={genres} />
    </div>
  );
};

export default MovieAndTVTables;