// Movies
export const fetchTopRatedMovies = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjA4OGM1MWFjYzg3YjlmMzdhYzdjMzFjNjM4NTVjYiIsIm5iZiI6MTcyNjczMzM1My42OTUxNjIsInN1YiI6IjY2ZWI4NmFkNTE2OGE4OTZlMTFmYzM0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lm71BhcljFCv_p0eBMx0TpOOf8cuXwbeT-SalQYkyIs',
    },
  };

  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const data = await response.json();
    return data.results.map((movie: { title: string; id: number; poster_path: string; genre_ids: number[]; vote_average: number }) => ({
      title: movie.title,
      id: movie.id,
      poster_path: movie.poster_path,
      genre_ids: movie.genre_ids,
      vote_average: movie.vote_average,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchNowPlayingMovies = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjA4OGM1MWFjYzg3YjlmMzdhYzdjMzFjNjM4NTVjYiIsIm5iZiI6MTcyNjczMzM1My42OTUxNjIsInN1YiI6IjY2ZWI4NmFkNTE2OGE4OTZlMTFmYzM0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lm71BhcljFCv_p0eBMx0TpOOf8cuXwbeT-SalQYkyIs',
    },
  };

  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const data = await response.json();
    return data.results.map((movie: { title: string; id: number; poster_path: string; genre_ids: number[]; vote_average: number }) => ({
      title: movie.title,
      id: movie.id,
      poster_path: movie.poster_path,
      genre_ids: movie.genre_ids,
      vote_average: movie.vote_average,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchGenres = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjA4OGM1MWFjYzg3YjlmMzdhYzdjMzFjNjM4NTVjYiIsIm5iZiI6MTcyNjczMzM1My42OTUxNjIsInN1YiI6IjY2ZWI4NmFkNTE2OGE4OTZlMTFmYzM0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lm71BhcljFCv_p0eBMx0TpOOf8cuXwbeT-SalQYkyIs',
    },
  };

  try {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', options);
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    const data = await response.json();
    return data.genres; // Ini akan mengembalikan array genre dengan id dan nama
  } catch (error) {
    console.error(error);
    return [];
  }
};

//TVs
export const fetchTopRatedTV = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjA4OGM1MWFjYzg3YjlmMzdhYzdjMzFjNjM4NTVjYiIsIm5iZiI6MTcyNjc5NDk0OS4xNTQ5NjcsInN1YiI6IjY2ZWI4NmFkNTE2OGE4OTZlMTFmYzM0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.U56mgHHYAHbYdOKVj8s9NEb_RAZrnFxKcBTzYJQe6g4',
    },
  };

  try {
    const response = await fetch('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1', options);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const data = await response.json();
    return data.results.map((tv: { name: string; id: number; poster_path: string; genre_ids: number[]; vote_average: number }) => ({
      title: tv.name,
      id: tv.id,
      poster_path: tv.poster_path,
      genre_ids: tv.genre_ids,
      vote_average: tv.vote_average,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Fungsi untuk fetch TV Airing Today
export const fetchAiringTodayTVShows = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjA4OGM1MWFjYzg3YjlmMzdhYzdjMzFjNjM4NTVjYiIsIm5iZiI6MTcyNjc5NDk0OS4xNTQ5NjcsInN1YiI6IjY2ZWI4NmFkNTE2OGE4OTZlMTFmYzM0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.U56mgHHYAHbYdOKVj8s9NEb_RAZrnFxKcBTzYJQe6g4',
    },
  };
  
  try {
    const response = await fetch('https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1', options);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const data = await response.json();
    return data.results.map((tv: { name: string; id: number; poster_path: string; genre_ids: number[]; vote_average: number }) => ({
      title: tv.name,
      id: tv.id,
      poster_path: tv.poster_path,
      genre_ids: tv.genre_ids,
      vote_average: tv.vote_average,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

