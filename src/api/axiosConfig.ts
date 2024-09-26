// src/api/axiosConfig.ts
import axios from 'axios';

const API_KEY = "ff088c51acc87b9f37ac7c31c63855cb";

// Create Axios instance with global headers
const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjA4OGM1MWFjYzg3YjlmMzdhYzdjMzFjNjM4NTVjYiIsIm5iZiI6MTcyNjczMzM1My42OTUxNjIsInN1YiI6IjY2ZWI4NmFkNTE2OGE4OTZlMTFmYzM0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lm71BhcljFCv_p0eBMx0TpOOf8cuXwbeT-SalQYkyIs',
  },
  params: {
    api_key: API_KEY,
    language: 'en-US'
  }
});

export default axiosInstance;
