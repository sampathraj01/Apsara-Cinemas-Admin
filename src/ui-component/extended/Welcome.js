import React from 'react';
import { Typography, Container, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

const WelcomeMagoPrinpro = () => {
    const empName = window.localStorage.getItem('empname'); //  fetch only name

    return (
        <Container sx={{ mt: 4 }}>
            <MainCard>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '400px' // Adjust height as needed
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        Hello! <strong>{empName}</strong>
                    </Typography>
                    <Typography variant="h2" gutterBottom>
                        Welcome to Mago-Prinpro
                    </Typography>
                    
                </Box>
            </MainCard>
        </Container>
    );
};

export default WelcomeMagoPrinpro;
