import React from "react";
import Grid from "@mui/material/Grid2";
import Bookmark from "../components/SavedBookmarks";

const BookmarkPage: React.FC = () => {
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
        <Bookmark />
      </Grid>
    </Grid>
  );
};

export default BookmarkPage;
