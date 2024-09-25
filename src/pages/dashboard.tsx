import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MoviesPage from "./MoviesPage";
import TVShowsPage from "./TVShowsPage";
import ShowsTable from "../components/ShowsTable";
import MovieTable from "../components/ShowsTable";
import TVShowTable from "../components/TVShowTable";

const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Top Rated Movies");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Grid container direction="column" sx={{ minHeight: "100vh" }}>
      {/* Header */}
      <Grid>
        <Header onCategorySelect={handleCategorySelect} />
      </Grid>
  
      {/* Konten Utama */}
      <Grid sx={{ flexGrow: 1, padding: 2 }}>
        {selectedCategory.includes("Movies") ? (
          <MovieTable />
        ) : (
          <TVShowTable />
        )}
      </Grid>
  
      {/* Footer */}
      <Grid>
        <Footer />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
