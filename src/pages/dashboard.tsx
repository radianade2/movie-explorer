// src/pages/Dashboard.tsx
import React from 'react';
import Grid from '@mui/material/Grid2';
// import { Container} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import Movies from '../components/Movies';
// import TVTable from '../components/TVShows';
// import Book from '../components/Bookmarked';
import ShowsTable from '../components/ShowsTable';

const Dashboard: React.FC = () => {

    return(
        <Grid container direction="column" sx={{ minHeight: "100vh", }}>
            {/* Header */}
            <Grid>
                <Header />
            </Grid>

            <Grid sx={{ flexGrow: 1, padding: '50px', mt:'30px', mb:'30px', alignContent:"center"}}>
                {/* <Movies /> */}
                {/* <Book /> */}
                {/* <TVTable /> */}
                <ShowsTable />
            </Grid>

            {/* Footer */}
            <Grid>
                <Footer />
            </Grid>
        </Grid>
    );
};

export default Dashboard;