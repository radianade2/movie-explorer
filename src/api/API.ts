import axios from 'axios';

const API_KEY = 'xxxxxxxxxxx'; 
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = (endpoint: string) => {
  return axios.get(`${BASE_URL}/${endpoint}?api_key=${API_KEY}`);
};

export const fetchTopRatedMovies = async () => {
  const response = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
  return response.data.results; // Return only the results array
};

