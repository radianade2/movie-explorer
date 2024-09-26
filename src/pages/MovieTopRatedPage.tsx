import React from "react";
import Grid from "@mui/material/Grid2";
import MovieTableTopRated from "../components/MovieTableTopRated";

const MovieTopRatedPage: React.FC = () => {
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
        <MovieTableTopRated />
      </Grid>
    </Grid>
  );
};

export default MovieTopRatedPage;
