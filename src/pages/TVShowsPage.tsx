import React, { useState, useEffect } from "react";
import {
  fetchTopRatedTV,
  fetchAiringTodayTVShows,
  fetchGenres,
} from "../api/apiConfig"; // API untuk TV Shows
import ShowsTable from "../components/ShowsTable";

interface Props {
  selectedCategory: string;
}

const TVShowsPage: React.FC<Props> = ({ selectedCategory }) => {
  // const [topRatedTVShows, setTopRatedTVShows] = useState([]);
  // const [airingTodayTVShows, setAiringTodayTVShows] = useState([]);

  const [tvShows, setTvShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchTVShowsData = async () => {
      try {
        // const [topRatedTVShowsData, airingTodayTVShowsData, genresData] = await Promise.all([
        //   fetchTopRatedTV(),
        //   fetchAiringTodayTVShows(),
        //   fetchGenres(),
        // ]);

        // setTopRatedTVShows(topRatedTVShowsData.slice(0, 5));
        // setAiringTodayTVShows(airingTodayTVShowsData.slice(0, 5));

        const tvShowsData =
          selectedCategory === "Top Rated TV Shows"
            ? await fetchTopRatedTV()
            : await fetchAiringTodayTVShows();

        const genresData = await fetchGenres();

        setTvShows(tvShowsData.slice(0, 5));
        setGenres(genresData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching TV shows data:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchTVShowsData();
  }, [selectedCategory]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading TV shows data</div>;

  return (
    <div>
      {/* <ShowsTable title="Top Rated TV Shows" shows={topRatedTVShows} genres={genres} />
      <ShowsTable title="Airing Today TV Shows" shows={airingTodayTVShows} genres={genres} /> */}
      <ShowsTable title={selectedCategory} shows={tvShows} genres={genres} />
    </div>
  );
};

export default TVShowsPage;
