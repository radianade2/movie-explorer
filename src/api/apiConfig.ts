// src/api/apiConfig.ts
import axiosInstance from './axiosConfig';

// Genres
export const fetchGenres = async () => {
  try {
    const response = await axiosInstance.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

// Movie
export const fetchTopRatedMovies = async (page: number = 1) => {
  try {
    const response = await axiosInstance.get('/movie/top_rated', {
      params: { page }
    });
    return {
      results: response.data.results.map((movie: { title: string; id: number; poster_path: string; genre_ids: number[]; vote_average: number }) => ({
        title: movie.title,
        id: movie.id,
        poster_path: movie.poster_path,
        genre_ids: movie.genre_ids,
        vote_average: movie.vote_average,
      })),
      total_pages: response.data.total_pages, // total pages returned by API
      total_results: response.data.total_results, // Total number of movies returned by API
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [], total_pages: 1, total_results: 0 };
  }
};

export const fetchNowPlayingMovies = async (page: number = 1) => {
  try {
    const response = await axiosInstance.get('/movie/now_playing', {
      params: { page }
    });
    return {
      results: response.data.results.map((movie: { title: string; id: number; poster_path: string; genre_ids: number[]; vote_average: number }) => ({
        title: movie.title,
        id: movie.id,
        poster_path: movie.poster_path,
        genre_ids: movie.genre_ids,
        vote_average: movie.vote_average,
      })),
      total_pages: response.data.total_pages, // total pages returned by API
      total_results: response.data.total_results, // Total number of movies returned by API
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [], total_pages: 1, total_results: 0 };
  }
};

// TV
export const fetchTopRatedTV = async (page: number = 1) => {
  try {
    const response = await axiosInstance.get('/tv/top_rated', {
      params: { page }
    });
    return {
      results: response.data.results.map((tv: { name: string; id: number; poster_path: string; genre_ids: number[]; vote_average: number }) => ({
        title: tv.name,  // Changed 'title' to 'name'
        id: tv.id,
        poster_path: tv.poster_path,
        genre_ids: tv.genre_ids,
        vote_average: tv.vote_average,
      })),
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    };
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return { results: [], total_pages: 1, total_results: 0 };
  }
};

export const fetchAiringTodayTVShows = async (page: number = 1) => {
  try {
    const response = await axiosInstance.get('/tv/airing_today', {
      params: { page }
    });
    return {
      results: response.data.results.map((tv: { name: string; id: number; poster_path: string; genre_ids: number[]; vote_average: number }) => ({
        title: tv.name,  // Changed 'title' to 'name'
        id: tv.id,
        poster_path: tv.poster_path,
        genre_ids: tv.genre_ids,
        vote_average: tv.vote_average,
      })),
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    };
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return { results: [], total_pages: 1, total_results: 0 };
  }
};

// Fetch movies by their IDs
export const fetchMoviesByIds = async (ids: number[]) => {
  try {
    const promises = ids.map((id) => axiosInstance.get(`/movie/${id}`));
    const responses = await Promise.all(promises);
    return responses.map((response) => ({
      id: response.data.id,
      title: response.data.title,
      poster_path: response.data.poster_path,
      genre_ids: response.data.genre_ids,
      vote_average: response.data.vote_average,
    }));
  } catch (error) {
    console.error('Error fetching movies by IDs:', error);
    return [];
  }
};

// Fetch TV shows by their IDs
export const fetchTVShowsByIds = async (ids: number[]) => {
  try {
    const promises = ids.map((id) => axiosInstance.get(`/tv/${id}`));
    const responses = await Promise.all(promises);
    return responses.map((response) => ({
      id: response.data.id,
      title: response.data.name,  // TV shows use 'name' instead of 'title'
      poster_path: response.data.poster_path,
      genre_ids: response.data.genre_ids,
      vote_average: response.data.vote_average,
    }));
  } catch (error) {
    console.error('Error fetching TV shows by IDs:', error);
    return [];
  }
};