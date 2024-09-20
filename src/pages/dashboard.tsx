import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Grid } from '@mui/material';

const Dashboard: React.FC = () => {
    return(
        <Grid container direction="column" sx={{ minHeight: '100vh' }}>
            <Grid item>
                <Header/>
            </Grid>

            <Grid item sx={{flexGrow: 1, mt: 11, mb: 8, }}>
                ini komponen utama
            </Grid>

            <Grid item>
            <Footer/>
            </Grid>
        </Grid>
        
    )
}

export default Dashboard;