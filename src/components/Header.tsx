import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { z } from "zod"; // Import zod
import axiosInstance from "../api/axiosConfig"; // Import axiosInstance
import LogoSection from "../components/logoSection"; // Import the new component

const searchSchema = z
  .string()
  .min(3, "Search query must be at least 3 characters long");

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null); // State for error message

  const navigate = useNavigate();

  const handleSearchChange = async (newInputValue: string) => {
    setSearchQuery(newInputValue);

    try {
      // Validate search query using zod schema
      searchSchema.parse(newInputValue);
      setSearchError(null); // Reset error if valid

      if (newInputValue.length > 2) {
        const response = await axiosInstance.get("/search/multi", {
          params: {
            query: newInputValue,
            page: 1,
            include_adult: false,
          },
        });
        setSearchResults(response.data.results);
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
          {/* Use the new LogoSection component */}
          <LogoSection />

          <Autocomplete
            sx={{ mr: 2, marginLeft: "auto", width: "300px" }}
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
