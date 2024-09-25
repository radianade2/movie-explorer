import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Autocomplete,
} from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { z } from "zod"; // Import zod

interface Props {
  onCategorySelect: (category: string) => void;
}

const searchSchema = z
  .string()
  .min(3, "Search query must be at least 3 characters long");

const Header: React.FC<Props> = ({ onCategorySelect }) => {
  const [movieAnchorEl, setMovieAnchorEl] = useState<null | HTMLElement>(null);
  const [tvShowAnchorEl, setTVShowAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null); // State for error message

  const navigate = useNavigate();
  const apiKey = "ff088c51acc87b9f37ac7c31c63855cb";

  const handleMoviesMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMovieAnchorEl(event.currentTarget);
  };

  const handleMoviesMenuClose = (category: string) => {
    setMovieAnchorEl(null);

    if (category === "Top Rated Movies") {
      navigate("/movies/top-rated"); // Navigasi ke halaman MovieTable
    } else if (category === "Now Playing Movies") {
      navigate("/movies/now-playing"); 
    }
  };

  const handleTVShowsMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setTVShowAnchorEl(event.currentTarget);
  };

  const handleTVShowsMenuClose = (category: string) => {
    console.log("Navigating to:", category);
    setTVShowAnchorEl(null);
    
    if (category === "Top Rated TV Shows") {
      navigate("/tv/top-rated"); // Navigasi ke halaman TVShowTable
    } else if (category === "Airing Today TV Shows") {
      navigate("/tv/airing-today"); 
    }

    onCategorySelect(category);
  };

  const handleSearchChange = async (newInputValue: string) => {
    setSearchQuery(newInputValue);

    try {
      // Validate search query using zod schema
      searchSchema.parse(newInputValue);
      setSearchError(null); // Reset error if valid

      if (newInputValue.length > 2) {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${newInputValue}&page=1&include_adult=false`
        );
        const data = await response.json();
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      // Handle validation error
      if (error instanceof z.ZodError) {
        setSearchError(error.errors[0].message); // Show error message if validation fails
        setSearchResults([]);
      }
    }
  };

  const handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.length > 2 && !searchError) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar sx={{ backgroundColor: "#FECE04", animation: "fadeIn 0.5s" }}>
          <LocalMoviesIcon sx={{ color: "#333" }} />
          <Typography sx={{ marginLeft: "10px", color: "#333" }}>
            Cinemaku
          </Typography>

          <Button
            sx={{ marginLeft: "auto", color: "#333" }}
            color="inherit"
            onClick={handleMoviesMenuClick}
          >
            Movies
          </Button>
          <Menu
            anchorEl={movieAnchorEl}
            open={Boolean(movieAnchorEl)}
            onClose={() => setMovieAnchorEl(null)}
          >
            <MenuItem onClick={() => handleMoviesMenuClose("Top Rated Movies")}>
              Top Rated
            </MenuItem>
            <MenuItem
              onClick={() => handleMoviesMenuClose("Now Playing Movies")}
            >
              Now Playing
            </MenuItem>
          </Menu>

          <Button
            sx={{ color: "#333" }}
            color="inherit"
            onClick={handleTVShowsMenuClick}
          >
            TV Shows
          </Button>
          <Menu
            anchorEl={tvShowAnchorEl}
            open={Boolean(tvShowAnchorEl)}
            onClose={() => setTVShowAnchorEl(null)}
          >
            <MenuItem
              onClick={() => handleTVShowsMenuClose("Top Rated TV Shows")}
            >
              Top Rated
            </MenuItem>
            <MenuItem
              onClick={() => handleTVShowsMenuClose("Airing Today TV Shows")}
            >
              Airing Today
            </MenuItem>
          </Menu>

          <Autocomplete
            sx={{ mr: 2 }}
            freeSolo
            options={searchResults.map(
              (option: any) => option.title || option.name
            )}
            onInputChange={(event, newInputValue) =>
              handleSearchChange(newInputValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder="Search..."
                onKeyDown={handleSearchSubmit} // Submit on Enter
                error={!!searchError} // Display error state if there's an error
                helperText={searchError} // Show error message if validation fails
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{color:"#333"}}/>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginLeft: "20px",
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
