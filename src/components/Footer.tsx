import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: "#063970",
          color: "white",
          textAlign: "center",
          position: "fixed",
          padding:"10px",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "40px",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.5s",
        }}
      >
        <Typography variant="body2" sx={{ marginTop: "10px" }}>
          © 2024 Cinemaku. All rights reserved.
        </Typography>

        <Box></Box>
      </Box>
    </React.Fragment>
  );
};

export default Footer;