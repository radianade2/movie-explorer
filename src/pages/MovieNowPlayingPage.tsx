import React from "react";
import Grid from "@mui/material/Grid2";
import MovieTableNowPlaying from "../components/MovieTableNowPlaying";
// import ShowsTable from '../components/No_Tanstack_Table';

const MovieNowPlayingPage: React.FC = () => {
  return (
    <Grid container direction="column" sx={{ minHeight: "100vh" }}>
      <Grid
        sx={{
          flexGrow: 1,
          padding: "50px",
          mt: "30px",
          mb: "30px",
          alignContent: "center",
        }}
      >
        <MovieTableNowPlaying />
      </Grid>
    </Grid>
  );
};

export default MovieNowPlayingPage;
