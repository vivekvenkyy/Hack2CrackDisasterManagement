import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import './Realtime.css';

function Realtime() {
    const [formData, setFormData] = useState({
        MonsoonIntensity: '0',
        TopographyDrainage: '0',
        RiverManagement: '0',
        Deforestation: '0',
        Urbanization: '0',
        ClimateChange: '0',
        DamsQuality: '0',
        Siltation: '0',
        AgriculturalPractices: '0',
        Encroachments: '0',
        IneffectiveDisasterPreparedness: '0',
        DrainageSystems: '0',
        CoastalVulnerability: '0',
        Landslides: '0',
        Watersheds: '0',
        DeterioratingInfrastructure: '0',
        PopulationScore: '0',
        WetlandLoss: '0',
        InadequatePlanning: '0',
        PoliticalFactors: '0'
    });
    const [prediction, setPrediction] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Convert to integer
        const intValue = parseInt(value, 10);
        setFormData(prevState => ({
            ...prevState,
            [name]: intValue.toString()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting data:', formData);
        try {
            // Convert all values to integers before sending
            const integerFormData = Object.keys(formData).reduce((acc, key) => {
                acc[key] = parseInt(formData[key], 10);
                return acc;
            }, {});

            const response = await fetch('http://localhost:5000/api/predict-flood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(integerFormData),
            });
            console.log('Response received:', response);

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
            }

            const data = await response.json();
            console.log('Prediction data:', data);
            setPrediction(data.prediction);
        } catch (error) {
            console.error('Detailed error:', error);
            alert(`Error making prediction: ${error.message}`);
        }
    };

    const features = [
        'MonsoonIntensity', 'TopographyDrainage', 'RiverManagement', 'Deforestation',
        'Urbanization', 'ClimateChange', 'DamsQuality', 'Siltation',
        'AgriculturalPractices', 'Encroachments', 'IneffectiveDisasterPreparedness',
        'DrainageSystems', 'CoastalVulnerability', 'Landslides', 'Watersheds',
        'DeterioratingInfrastructure', 'PopulationScore', 'WetlandLoss',
        'InadequatePlanning', 'PoliticalFactors'
    ];

    return (
        <div className="realtime-container">
            <Container>
                <h2 className="realtime-title">Flood Prediction System</h2>
                <div className="form-container">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {features.map((feature, index) => (
                                <Col md={6} key={index}>
                                    <Form.Group className="input-group">
                                        <div className="feature-label">
                                            <span className="feature-name">
                                                {feature.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                            <span className="range-value">
                                                Value: {formData[feature]}
                                            </span>
                                        </div>
                                        <Form.Control
                                            type="range"
                                            min="0"
                                            max="10"
                                            step="1"  // Changed to 1 for integer values
                                            name={feature}
                                            value={formData[feature]}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <div className="range-markers">
                                            <span>0</span>
                                            <span>5</span>
                                            <span>10</span>
                                        </div>
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>

                        <Button 
                            type="submit" 
                            className="submit-button"
                        >
                            Predict Flood Probability
                        </Button>
                    </Form>

                    {prediction !== null && (
                        <Card className="prediction-card">
                            <Card.Body>
                                <Card.Title>Prediction Result</Card.Title>
                                <Card.Text>
                                    Probability of Flood: {(prediction * 100).toFixed(2)}%
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default Realtime; 