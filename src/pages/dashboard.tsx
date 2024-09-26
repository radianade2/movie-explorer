// src/pages/Dashboard.tsx
import React from 'react';
import Grid from '@mui/material/Grid2';
// import { Container} from '@mui/material';
// import Movies from '../components/Movies';
// import TVTable from '../components/TVShows';
import Book from '../components/Bookmarked';
// import ShowsTable from '../components/No_Tanstack_Table';

const Dashboard: React.FC = () => {

    return(
        <Grid container direction="column" sx={{ minHeight: "100vh", }}>

            <Grid sx={{ flexGrow: 1, padding: '50px', mt:'30px', mb:'30px', alignContent:"center"}}>
                {/* <Movies /> */}
                <Book />
                {/* <TVTable /> */}
            </Grid>

        </Grid>
    );
};

export default Dashboard;
