import React from "react";
import { Typography } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import { useNavigate } from "react-router-dom"; // For navigation

const LogoSection: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/"); // Navigate to the dashboard page (root path "/")
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }} // Make it clickable
      onClick={handleLogoClick}
    >
      <LocalMoviesIcon sx={{ color: "#333" }} />
      <Typography sx={{ marginLeft: "10px", color: "#333" }}>
        Cinemaku
      </Typography>
    </div>
  );
};

export default LogoSection;
