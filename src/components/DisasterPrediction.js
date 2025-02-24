import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    Paper,
    Container,
    Alert,
    Snackbar,
    CircularProgress,
    Divider,
    IconButton,
    useTheme
} from '@mui/material';
import Plot from 'react-plotly.js';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import TimelineIcon from '@mui/icons-material/Timeline';

const DisasterPrediction = () => {
    const theme = useTheme();
    const [predictions, setPredictions] = useState(null);
    const [graphs, setGraphs] = useState(null);
    const [country, setCountry] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'error'
    });

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/disaster-predictions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ country, year: parseInt(year) }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch predictions');
            }

            setPredictions(data.predictions);
            setGraphs(data.graphs);

            if (data.predictions.length === 0) {
                setSnackbar({
                    open: true,
                    message: `No predictions found for ${country} in year ${year}`,
                    severity: 'info'
                });
            }
        } catch (err) {
            setError(err.message);
            setSnackbar({
                open: true,
                message: err.message,
                severity: 'error'
            });
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRiskLevelColor = (riskLevel) => {
        switch (riskLevel.toLowerCase()) {
            case 'high':
                return theme.palette.error.main;
            case 'medium':
                return theme.palette.warning.main;
            default:
                return theme.palette.success.main;
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        mb: 4, 
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        color: 'white'
                    }}
                >
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Disaster Prediction Analysis
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Analyze potential natural disasters based on historical data
                    </Typography>
                </Paper>

                <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                    variant="outlined"
                                    placeholder="Enter country name"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Year"
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    required
                                    variant="outlined"
                                    InputProps={{ 
                                        inputProps: { 
                                            min: 2024, 
                                            max: 2035 
                                        }
                                    }}
                                    placeholder="Enter year (2024-2035)"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={loading}
                                    fullWidth
                                    size="large"
                                    startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                                    sx={{ height: '56px' }}
                                >
                                    {loading ? 'Analyzing...' : 'Analyze Predictions'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>

                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 4 }}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setError(null)}
                            >
                                <WarningIcon />
                            </IconButton>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {predictions && predictions.length > 0 && (
                    <>
                        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
                            Prediction Results
                        </Typography>
                        <Grid container spacing={3}>
                            {predictions.map((prediction, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card 
                                        elevation={3}
                                        sx={{ 
                                            height: '100%',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.02)'
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Typography 
                                                variant="h6" 
                                                gutterBottom 
                                                color="primary"
                                            >
                                                {prediction.disasterType}
                                            </Typography>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                Probability: {prediction.probability.toFixed(1)}%
                                            </Typography>
                                            <Typography 
                                                variant="body1"
                                                sx={{ 
                                                    color: getRiskLevelColor(prediction.riskLevel),
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Risk Level: {prediction.riskLevel}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                {graphs && graphs.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography 
                            variant="h5" 
                            gutterBottom 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1 
                            }}
                        >
                            <TimelineIcon color="primary" />
                            Visualization Analysis
                        </Typography>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            {graphs.map((graph, index) => (
                                <Plot
                                    key={index}
                                    data={graph.data}
                                    layout={{
                                        ...graph.layout,
                                        autosize: true,
                                        height: 500,
                                        margin: { l: 50, r: 50, t: 50, b: 50 }
                                    }}
                                    style={{ width: '100%' }}
                                    config={{ responsive: true }}
                                />
                            ))}
                        </Paper>
                    </Box>
                )}

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default DisasterPrediction;