import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Realtime.css';

function RealTime() {
    const [predictionType, setPredictionType] = useState('flood');
    const [formData, setFormData] = useState({
        // Flood features
        MonsoonIntensity: '',
        TopographyDrainage: '',
        RiverManagement: '',
        Deforestation: '',
        Urbanization: '',
        ClimateChange: '',
        DamsQuality: '',
        Siltation: '',
        AgriculturalPractices: '',
        Encroachments: '',
        IneffectiveDisasterPreparedness: '',
        DrainageSystems: '',
        CoastalVulnerability: '',
        Landslides: '',
        Watersheds: '',
        DeterioratingInfrastructure: '',
        PopulationScore: '',
        WetlandLoss: '',
        InadequatePlanning: '',
        PoliticalFactors: '',
        // Drought features
        fips: '',
        PS: '',
        QV2M: '',
        T2M: '',
        T2MDEW: '',
        T2M_MAX: '',
        T2M_MIN: '',
        T2M_RANGE: '',
        TS: '',
        WS10M: '',
        WS10M_RANGE: '',
        WS50M: '',
        WS50M_MAX: '',
        WS50M_RANGE: '',
        date: ''
    });

    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setPrediction(null);
        setLoading(true);

        try {
            const endpoint = predictionType === 'flood' ? 
                'http://localhost:5000/api/predict-flood' : 
                'http://localhost:5000/api/predict-drought';

            const submissionData = predictionType === 'flood' ? 
                {
                    MonsoonIntensity: parseFloat(formData.MonsoonIntensity),
                    TopographyDrainage: parseFloat(formData.TopographyDrainage),
                    RiverManagement: parseFloat(formData.RiverManagement),
                    Deforestation: parseFloat(formData.Deforestation),
                    Urbanization: parseFloat(formData.Urbanization),
                    ClimateChange: parseFloat(formData.ClimateChange),
                    DamsQuality: parseFloat(formData.DamsQuality),
                    Siltation: parseFloat(formData.Siltation),
                    AgriculturalPractices: parseFloat(formData.AgriculturalPractices),
                    Encroachments: parseFloat(formData.Encroachments),
                    IneffectiveDisasterPreparedness: parseFloat(formData.IneffectiveDisasterPreparedness),
                    DrainageSystems: parseFloat(formData.DrainageSystems),
                    CoastalVulnerability: parseFloat(formData.CoastalVulnerability),
                    Landslides: parseFloat(formData.Landslides),
                    Watersheds: parseFloat(formData.Watersheds),
                    DeterioratingInfrastructure: parseFloat(formData.DeterioratingInfrastructure),
                    PopulationScore: parseFloat(formData.PopulationScore),
                    WetlandLoss: parseFloat(formData.WetlandLoss),
                    InadequatePlanning: parseFloat(formData.InadequatePlanning),
                    PoliticalFactors: parseFloat(formData.PoliticalFactors)
                } : 
                {
                    fips: formData.fips,
                    PS: parseFloat(formData.PS),
                    QV2M: parseFloat(formData.QV2M),
                    T2M: parseFloat(formData.T2M),
                    T2MDEW: parseFloat(formData.T2MDEW),
                    T2M_MAX: parseFloat(formData.T2M_MAX),
                    T2M_MIN: parseFloat(formData.T2M_MIN),
                    T2M_RANGE: parseFloat(formData.T2M_RANGE),
                    TS: parseFloat(formData.TS),
                    WS10M: parseFloat(formData.WS10M),
                    WS10M_RANGE: parseFloat(formData.WS10M_RANGE),
                    WS50M: parseFloat(formData.WS50M),
                    WS50M_MAX: parseFloat(formData.WS50M_MAX),
                    WS50M_RANGE: parseFloat(formData.WS50M_RANGE),
                    date: formData.date
                };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            const data = await response.json();

            if (response.ok) {
                setPrediction(data.prediction);
            } else {
                setError(data.error || 'Failed to get prediction');
            }
        } catch (err) {
            setError('Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    const floodFeatures = [
        { name: 'MonsoonIntensity', label: 'Monsoon Intensity' },
        { name: 'TopographyDrainage', label: 'Topography & Drainage' },
        { name: 'RiverManagement', label: 'River Management' },
        { name: 'Deforestation', label: 'Deforestation' },
        { name: 'Urbanization', label: 'Urbanization' },
        { name: 'ClimateChange', label: 'Climate Change Impact' },
        { name: 'DamsQuality', label: 'Dams Quality' },
        { name: 'Siltation', label: 'Siltation Level' },
        { name: 'AgriculturalPractices', label: 'Agricultural Practices' },
        { name: 'Encroachments', label: 'Encroachments' },
        { name: 'IneffectiveDisasterPreparedness', label: 'Disaster Preparedness' },
        { name: 'DrainageSystems', label: 'Drainage Systems' },
        { name: 'CoastalVulnerability', label: 'Coastal Vulnerability' },
        { name: 'Landslides', label: 'Landslides Risk' },
        { name: 'Watersheds', label: 'Watersheds Condition' },
        { name: 'DeterioratingInfrastructure', label: 'Infrastructure Condition' },
        { name: 'PopulationScore', label: 'Population Density' },
        { name: 'WetlandLoss', label: 'Wetland Loss' },
        { name: 'InadequatePlanning', label: 'Planning Adequacy' },
        { name: 'PoliticalFactors', label: 'Political Factors' }
    ];

    const droughtFeatures = [
        { name: 'fips', label: 'FIPS Code', type: 'number', step: '1' },
        { name: 'PS', label: 'Surface Pressure', type: 'number', step: '0.01' },
        { name: 'QV2M', label: 'Specific Humidity at 2m', type: 'number', step: '0.01' },
        { name: 'T2M', label: 'Temperature at 2m', type: 'number', step: '0.01' },
        { name: 'T2MDEW', label: 'Dew/Frost Point at 2m', type: 'number', step: '0.01' },
        { name: 'T2M_MAX', label: 'Maximum Temperature at 2m', type: 'number', step: '0.01' },
        { name: 'T2M_MIN', label: 'Minimum Temperature at 2m', type: 'number', step: '0.01' },
        { name: 'T2M_RANGE', label: 'Temperature Range at 2m', type: 'number', step: '0.01' },
        { name: 'TS', label: 'Surface Temperature', type: 'number', step: '0.01' },
        { name: 'WS10M', label: 'Wind Speed at 10m', type: 'number', step: '0.01' },
        { name: 'WS10M_RANGE', label: 'Wind Speed Range at 10m', type: 'number', step: '0.01' },
        { name: 'WS50M', label: 'Wind Speed at 50m', type: 'number', step: '0.01' },
        { name: 'WS50M_MAX', label: 'Maximum Wind Speed at 50m', type: 'number', step: '0.01' },
        { name: 'WS50M_RANGE', label: 'Wind Speed Range at 50m', type: 'number', step: '0.01' },
        { name: 'date', label: 'Date', type: 'date' }
    ];

    return (
        <Container fluid className="realtime-container py-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="prediction-card shadow-lg">
                    <Card.Header className="bg-gradient text-white text-center py-4">
                        <h2 className="mb-0">Disaster Prediction System</h2>
                        <p className="text-light mb-0 mt-2">Real-time analysis for flood and drought prediction</p>
                    </Card.Header>

                    <Card.Body className="px-4 py-5">
                        {/* Prediction Type Selector */}
                        <div className="prediction-type-selector mb-5">
                            <h4 className="text-center mb-4">Select Prediction Type</h4>
                            <div className="d-flex justify-content-center gap-4">
                                <Button 
                                    variant={predictionType === 'flood' ? 'primary' : 'outline-primary'}
                                    onClick={() => setPredictionType('flood')}
                                    className="prediction-type-btn"
                                    size="lg"
                                >
                                    <i className="fas fa-water me-2"></i>
                                    Flood Prediction
                                </Button>
                                <Button 
                                    variant={predictionType === 'drought' ? 'primary' : 'outline-primary'}
                                    onClick={() => setPredictionType('drought')}
                                    className="prediction-type-btn"
                                    size="lg"
                                >
                                    <i className="fas fa-sun me-2"></i>
                                    Drought Prediction
                                </Button>
                            </div>
                        </div>

                        {/* Form Section */}
                        <Form onSubmit={handleSubmit} className="prediction-form">
                            <Card className="feature-card mb-4">
                                <Card.Body>
                                    <h5 className="text-primary mb-4">
                                        {predictionType === 'flood' ? 'Flood Parameters' : 'Drought Parameters'}
                                    </h5>
                                    <Row className="g-4">
                                        {predictionType === 'drought' ? (
                                            droughtFeatures.map((feature, index) => (
                                                <Col md={6} lg={4} key={index}>
                                                    <Form.Group className="feature-group">
                                                        <Form.Label className="fw-bold">
                                                            {feature.label}
                                                        </Form.Label>
                                                        <Form.Control
                                                            type={feature.type}
                                                            step={feature.step}
                                                            name={feature.name}
                                                            value={formData[feature.name]}
                                                            onChange={handleInputChange}
                                                            required
                                                            placeholder={`Enter ${feature.label}`}
                                                            className="feature-input"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            ))
                                        ) : (
                                            floodFeatures.map((feature, index) => (
                                                <Col md={6} lg={4} key={index}>
                                                    <Form.Group className="feature-group">
                                                        <Form.Label className="fw-bold">
                                                            {feature.label}
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            step="0.01"
                                                            name={feature.name}
                                                            value={formData[feature.name]}
                                                            onChange={handleInputChange}
                                                            required
                                                            placeholder={`Enter ${feature.label}`}
                                                            className="feature-input"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            ))
                                        )}
                                    </Row>
                                </Card.Body>
                            </Card>

                            <div className="d-grid gap-2">
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    size="lg"
                                    className="submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-chart-line me-2"></i>
                                            Get Prediction
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>

                        {/* Results Section */}
                        {(prediction !== null || error) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mt-4"
                            >
                                {error ? (
                                    <Alert variant="danger" className="result-alert">
                                        <Alert.Heading>
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            Error
                                        </Alert.Heading>
                                        <p className="mb-0">{error}</p>
                                    </Alert>
                                ) : (
                                    <Alert variant="success" className="result-alert">
                                        <Alert.Heading>
                                            <i className="fas fa-check-circle me-2"></i>
                                            Prediction Result
                                        </Alert.Heading>
                                        <p className="mb-0">
                                            {predictionType === 'flood' 
                                                ? `Flood Probability: ${(prediction * 100).toFixed(2)}%`
                                                : `Drought Score: ${prediction.toFixed(2)}`
                                            }
                                        </p>
                                    </Alert>
                                )}
                            </motion.div>
                        )}
                    </Card.Body>
                </Card>
            </motion.div>
        </Container>
    );
}

export default RealTime; 