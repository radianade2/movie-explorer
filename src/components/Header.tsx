import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { z } from "zod"; // Import zod

import axiosInstance from "../api/axiosConfig"; // Import axiosInstance
import LogoSection from "../components/logoSection"; // Import the new component

interface Props {
  onCategorySelect: (category: string) => void;
}

const searchSchema = z
  .string()
  .min(1);

const Header: React.FC<Props> = ({ onCategorySelect }) => {
  const [movieAnchorEl, setMovieAnchorEl] = useState<null | HTMLElement>(null);
  const [tvShowAnchorEl, setTVShowAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null); // State for error message

  const navigate = useNavigate();

  // PILIHAN KATEGORI MOVIES
  const handleMoviesMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMovieAnchorEl(event.currentTarget);
  };

  const handleMoviesMenuClose = (category: string) => {
    setMovieAnchorEl(null);

    if (category === "Top Rated Movies") {
      navigate("/movies/top-rated");
    } else if (category === "Now Playing Movies") {
      navigate("/movies/now-playing");
    }
  };

  // PILIHAN KATEGORI TV
  const handleTVShowsMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setTVShowAnchorEl(event.currentTarget);
  };

  const handleTVShowsMenuClose = (category: string) => {
    setTVShowAnchorEl(null);

    if (category === "Top Rated TV Shows") {
      navigate("/tv/top-rated");
    } else if (category === "Airing Today TV Shows") {
      navigate("/tv/airing-today");
    }

    onCategorySelect(category);
  };

  // SEARCHBAR
  const handleSearchChange = (newInputValue: string) => {
    setSearchQuery(newInputValue);
    setSearchError(null); // Reset error when typing
  };

  const handleSearchSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Check if the search query is empty
      if (searchQuery.trim() === "") {
        setSearchError("Ketikkan pencarian anda");
        return;
      }

      // Validate the search query when Enter is pressed
      try {
        searchSchema.parse(searchQuery);
        setSearchError(null); // Clear any previous error

        // Perform search if query is valid
        const response = await axiosInstance.get("/search/multi", {
          params: {
            query: searchQuery,
            page: 1,
            include_adult: false,
          },
        });
        setSearchResults(response.data.results);
        navigate(`/search?query=${searchQuery}`);
      } catch (error) {
        if (error instanceof z.ZodError) {
          setSearchError(error.errors[0].message); // Show validation error
        }
      }
    }
  };

  return (
    <React.Fragment>
      <AppBar sx={{ position: "fixed" }}>
        <Toolbar sx={{ backgroundColor: "#FECE04", animation: "fadeIn 0.5s" }}>
          {/* Use the new LogoSection component */}
          <LogoSection />

          {/* PILIHAN KATEGORI MOVIES & TV SHOWS */}
          <Button sx={{ marginLeft: "auto", color: "#333" }} color="inherit" onClick={handleMoviesMenuClick}> Movies </Button>
          <Menu anchorEl={movieAnchorEl} open={Boolean(movieAnchorEl)} onClose={() => setMovieAnchorEl(null)}>
            <MenuItem onClick={() => handleMoviesMenuClose("Top Rated Movies")}> Top Rated </MenuItem>
            <MenuItem onClick={() => handleMoviesMenuClose("Now Playing Movies")}> Now Playing </MenuItem>
          </Menu>

          <Button sx={{ color: "#333" }} color="inherit" onClick={handleTVShowsMenuClick}> TV Shows </Button>
          <Menu anchorEl={tvShowAnchorEl} open={Boolean(tvShowAnchorEl)} onClose={() => setTVShowAnchorEl(null)}>
            <MenuItem onClick={() => handleTVShowsMenuClose("Top Rated TV Shows")}> Top Rated </MenuItem>
            <MenuItem onClick={() => handleTVShowsMenuClose("Airing Today TV Shows")}> Airing Today </MenuItem>
          </Menu>

          <Button sx={{ color: "#333" }} color="inherit" onClick={() => navigate("/bookmarks")}> Bookmark </Button>

          {/* SEARCHBAR */}
          <Autocomplete
            sx={{ mr: 2, ml: 2, width: "200px" }}
            freeSolo
            options={searchResults.map((option: any) => option.title || option.name)}
            onInputChange={(event, newInputValue) => handleSearchChange(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder={searchError || "Search..."}
                onKeyDown={handleSearchSubmit} // Submit on Enter
                error={!!searchError} // Display error state if there's an error
                // helperText={searchError} // Show error message if validation fails
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  width: "100%",
                  marginRight: "40px",
                }}
              />
            )}
          />
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
