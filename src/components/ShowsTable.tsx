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
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
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

const ShowsTable = ({ title, shows, genres }: { title: string; shows: Show[]; genres: Genre[] }) => {
  const [likeCount, setLikeCount] = useState<{ [key: number]: number }>({});

  const handleLike = (id: number) => {
    setLikeCount((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        {title}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Poster</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Like</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shows.map((show) => (
            <TableRow key={show.id}>
              <TableCell>
                <img
                  src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                  alt={show.title}
                  style={{ width: '50px', height: '75px' }}
                />
              </TableCell>
              <TableCell>{show.title}</TableCell>
              <TableCell>{getGenreNames(show.genre_ids)}</TableCell>
              <TableCell>{show.vote_average}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleLike(show.id)}>
                  <ThumbUpIcon />
                </IconButton>
                {likeCount[show.id] || 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MovieAndTVTables = () => {
  const [topRatedMovies, setTopRatedMovies] = useState<Show[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Show[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<Show[]>([]);
  const [airingTodayTVShows, setAiringTodayTVShows] = useState<Show[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          topRatedMoviesData,
          nowPlayingMoviesData,
          topRatedTVShowsData,
          airingTodayTVShowsData,
          genresData,
        ] = await Promise.all([
          fetchTopRatedMovies(),
          fetchNowPlayingMovies(),
          fetchTopRatedTV(),
          fetchAiringTodayTVShows(),
          fetchGenres(),
        ]);

        setTopRatedMovies(topRatedMoviesData.slice(0, 5));
        setNowPlayingMovies(nowPlayingMoviesData.slice(0, 5));
        setTopRatedTVShows(topRatedTVShowsData.slice(0, 5));
        setAiringTodayTVShows(airingTodayTVShowsData.slice(0, 5));
        setGenres(genresData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div>
      <ShowsTable title="Top Rated Movies" shows={topRatedMovies} genres={genres} />
      <ShowsTable title="Now Playing Movies" shows={nowPlayingMovies} genres={genres} />
      <ShowsTable title="Top Rated TV Shows" shows={topRatedTVShows} genres={genres} />
      <ShowsTable title="Airing Today TV Shows" shows={airingTodayTVShows} genres={genres} />
    </div>
  );
};

export default MovieAndTVTables;
