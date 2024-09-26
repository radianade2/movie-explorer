import React from "react";
import Grid from "@mui/material/Grid2";
import TVShowTableAiringToday from "../components/TVShowTableAiringToday";

const TVAiringTodayPage: React.FC = () => {
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
        <TVShowTableAiringToday />
      </Grid>
    </Grid>
  );
};

export default TVAiringTodayPage;
