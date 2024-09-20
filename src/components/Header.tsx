import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SearchIcon from "@mui/icons-material/Search";

const Header: React.FC = () => {
  const [value, setValue] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // Lakukan sesuatu dengan searchQuery, misalnya kirim ke backend atau filter data lokal
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar sx={{ backgroundColor: "#063970", animation: "fadeIn 0.5s", }}>
          <LocalMoviesIcon></LocalMoviesIcon>

          <Typography sx={{ marginLeft: "10px" }}>Cinemaku</Typography>

          <Tabs
            sx={{ marginLeft: "auto" }}
            textColor="inherit"
            value={value}
            onChange={(e, value) => setValue(value)}
            indicatorColor="primary"
          >
            <Tab label="Movies" />
            <Tab label="TV Shows" />
          </Tabs>

          <TextField size="small" variant="outlined" placeholder="Search..." value={searchQuery} onChange={handleSearchChange} 
          sx={{marginLeft:"20px",  backgroundColor:"white", borderRadius:10}}
          InputProps={{startAdornment:(
            <InputAdornment position = "start">
                <SearchIcon/>
            </InputAdornment>
          )}}/>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
