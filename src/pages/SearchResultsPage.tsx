import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box } from "@mui/material";

const SearchResults = () => {
  const [results, setResults] = useState<any[]>([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const apiKey = "ff088c51acc87b9f37ac7c31c63855cb";
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query && query.length > 2) {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${query}&page=1&include_adult=false`
          );
          const data = await response.json();
          setResults(data.results);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }
    };
    fetchSearchResults();
  }, [query]);

  return (
    <Container sx={{ mb: 10, mt:10 }}>
      <Typography variant="h4" gutterBottom>
        Search Results for: "{query}"
      </Typography>

      <Grid container spacing={4}>
        {results.length > 0 ? (
          results.map((result) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={result.id}>
              <Card sx={{ height: "100%" }}>
                {result.poster_path ? (
                  <CardMedia
                    component="img"
                    height="400"
                    image={`${posterBaseUrl}${result.poster_path}`}
                    alt={result.title || result.name}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "grey.300",
                    }}
                  >
                    <Typography variant="h6">No Image Available</Typography>
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {result.title || result.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.overview || "No description available."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="text.secondary" align="center" sx={{ width: "100%" }}>
            No results found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default SearchResults;
