import { useQuery } from "@tanstack/react-query";
import {
  fetchAiringTodayTVShows,
  fetchNowPlayingMovies,
  fetchTopRatedMovies,
  fetchTopRatedTV,
} from "./apiConfig";

//movies
export const useTopRatedMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ["topRatedMovies", page],
    queryFn: () => fetchTopRatedMovies(page),
  });
};

export const useNowPlayingMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ["nowPlayingMovies", page],
    queryFn: () => fetchNowPlayingMovies(page),
  });
};

//TV shows
export const useTopRatedTV = (page: number = 1) => {
  return useQuery({
    queryKey: ["topRatedTV", page],
    queryFn: () => fetchTopRatedTV(page),
  });
};

export const useAiringTodayTV = (page: number = 1) => {
  return useQuery({
    queryKey: ["topAiringTodayTV", page],
    queryFn: () => fetchAiringTodayTVShows(page),
  });
};


