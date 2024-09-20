// src/pages/Dashboard.tsx
import React from 'react';
import Grid from '@mui/material/Grid2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieAndTVTables from '../components/ShowsTable';

const Dashboard: React.FC = () => {
    return(
        <Grid>
            <Header />
            <MovieAndTVTables />
            <Footer />
        </Grid>
    );
};

export default Dashboard;