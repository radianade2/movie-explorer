// ini rencananya untuk card film yang nanti bisa ada rincian film, tombol like, dan tombol bookmark di card film-nya. tapi belum selesai
// src/components/Movies
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Button } from '@mui/material';
// import Grid from '@mui/material/Grid2';
import { BookmarkBorder, Bookmark, ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import {
  fetchTopRatedMovies,
  fetchNowPlayingMovies,
  fetchTopRatedTV,
  fetchAiringTodayTVShows
} from '../api/apiConfig';

const Dashboard: React.FC = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState([]);
  const [airingTodayTVShows, setAiringTodayTVShows] = useState([]);

  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const scrollRefs = {
    topRated: useRef<HTMLDivElement>(null),
    nowPlaying: useRef<HTMLDivElement>(null),
    airingToday: useRef<HTMLDivElement>(null),
    topRatedTV: useRef<HTMLDivElement>(null),
  }; // create ref for each category

  useEffect(() => {
    const loadData = async () => {
      const topRated = await fetchTopRatedMovies();
      const nowPlaying = await fetchNowPlayingMovies();
      const topRatedTV = await fetchTopRatedTV();
      const airingTodayTV = await fetchAiringTodayTVShows();

      setTopRatedMovies(topRated.results);
      setNowPlayingMovies(nowPlaying.results);
      setTopRatedTVShows(topRatedTV.results);
      setAiringTodayTVShows(airingTodayTV.results);
    };

    loadData();
  }, []);

  const handleScroll = (direction: string, category: string) => {
    const scrollContainer = scrollRefs[category].current;
    if (scrollContainer) {
      const scrollAmount = direction === 'right' ? scrollContainer.scrollLeft + 300 : scrollContainer.scrollLeft - 300;
      scrollContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleBookmarkToggle = (id: number) => {
    setBookmarked((prev) => {
      if (prev.includes(id)) {
        return prev.filter((movieId) => movieId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const renderMoviesAndShows = (data: any[], category: string) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <IconButton
          onClick={() => handleScroll('left', category)}
          sx={{
            position: 'absolute',
            left: -40,
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <ArrowBackIos />
        </IconButton>

        <Box
          ref={scrollRefs[category]} // assign the correct ref
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            width: '100%',
            padding: '10px 0',
          }}
        >
          {data.map((item) => (
            <Card
              key={item.id}
              sx={{
                minWidth: 200,
                margin: '0 10px',
                flexShrink: 0,
                position: 'relative',
                '&:hover .overlay': {
                  opacity: 1,
                },
              }}
            >
              <CardMedia
                component="img"
                alt={item.title}
                image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                sx={{ height: 250, width: '100%', objectFit: 'cover' }}
              />
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  opacity: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'opacity 0.3s ease',
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                  {item.release_date ? item.release_date.substring(0, 4) : 'N/A'}
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: '#fff', color: '#000', marginBottom: '10px' }}>
                  Cuplikan
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                  }}
                >
                  Opsi menonton
                </Button>
              </Box>

              <IconButton
                onClick={() => handleBookmarkToggle(item.id)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                {bookmarked.includes(item.id) ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <IconButton
          onClick={() => handleScroll('right', category)}
          sx={{
            position: 'absolute',
            right: -40,
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    );
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Top Rated Movies
      </Typography>
      {renderMoviesAndShows(topRatedMovies, 'topRated')}

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Now Playing Movies
      </Typography>
      {renderMoviesAndShows(nowPlayingMovies, 'nowPlaying')}

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Airing Today TV Shows
      </Typography>
      {renderMoviesAndShows(airingTodayTVShows, 'airingToday')}

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Top Rated TV Shows
      </Typography>
      {renderMoviesAndShows(topRatedTVShows, 'topRatedTV')}
    </Box>
  );
};

export default Dashboard;
