// import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';
import { fetchTopRatedMovies, fetchNowPlayingMovies } from '../api/apiConfig'; // Import API function

interface Movie {
  title: string;
  id: number;
}

export default function ComboBox() {
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const topRatedData = await fetchTopRatedMovies();
      setTopRatedMovies(topRatedData);

      const nowPlayingData = await fetchNowPlayingMovies();
      setNowPlayingMovies(nowPlayingData);
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Autocomplete untuk Top Rated Movies */}
      <Autocomplete
        disablePortal
        options={topRatedMovies}
        getOptionLabel={(option) => option.title}
        sx={{ width: 300, marginBottom: 2 }} // Menambahkan jarak antara dua Autocomplete
        renderInput={(params) => <TextField {...params} label="Top Rated Movies" />}
      />

      {/* Autocomplete untuk Now Playing Movies */}
      <Autocomplete
        disablePortal
        options={nowPlayingMovies}
        getOptionLabel={(option) => option.title}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Now Playing Movies" />}
      />
    </div>
  );
}
