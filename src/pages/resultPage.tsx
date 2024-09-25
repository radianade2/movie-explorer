import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, Card, CardContent, CardMedia, Box, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';
import axiosInstance from "../api/axiosConfig"; // Import axiosInstance
import Header from '../components/Header';
import Footer from '../components/Footer';

const SearchResults = () => {
  const [results, setResults] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null); // State for Read More
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query && query.length > 2) {
        try {
          const response = await axiosInstance.get("/search/multi", {
            params: {
              query: query,
              page: 1,
              include_adult: false,
            },
          });
          setResults(response.data.results);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }
    };
    fetchSearchResults();
  }, [query]);

  // Function to handle Read More
  const handleReadMore = (id: number) => {
    setExpandedId(expandedId === id ? null : id); // Toggle expand/collapse
  };

  return (
    <Container sx={{ mb: 10, mt:10 }}>
        <Grid>
            <Header />
        </Grid>
      <Typography variant="h5" gutterBottom align="center" padding={5}>
        Search Results for: "{query}"
      </Typography>

      <Grid container spacing={4} justifyContent="center"> {/* Center the grid */}
        {results.length > 0 ? (
          results.map((result) => (
            <Grid size={{ xs:1, sm:6, md:4, lg:3 }} key={result.id} sx={{ display: 'flex', justifyContent: 'center' }}> {/* Center individual cards */}
              <Card sx={{ width: "90%", height: "100%" }}> {/* Adjust card width */}
                {result.poster_path ? (
                  <CardMedia
                    component="img"
                    height="300" // Set height for the image
                    image={`${posterBaseUrl}${result.poster_path}`}
                    alt={result.title || result.name}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 300,
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

                  {/* Truncate description and add Read More */}
                  {result.overview && result.overview.length > 100 ? (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {expandedId === result.id
                          ? result.overview
                          : `${result.overview.slice(0, 100)}...`}
                      </Typography>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleReadMore(result.id)}
                      >
                        {expandedId === result.id ? "Read Less" : "Read More"}
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {result.overview || "No description available."}
                    </Typography>
                  )}
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

      <Grid>
        <Footer />
      </Grid>
    </Container>
  );
};

export default SearchResults;
