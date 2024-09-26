import React from "react";
import Grid from "@mui/material/Grid2";
import TVShowTableTopRated from "../components/TVShowTableTopRated";

const TVTopRatedPage: React.FC = () => {
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
        <TVShowTableTopRated />
      </Grid>
    </Grid>
  );
};

export default TVTopRatedPage;
