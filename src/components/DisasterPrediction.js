import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import './DisasterPrediction.css';

function DisasterPrediction() {
    // Initialize form data with empty values
    const [formData, setFormData] = useState({
        state: '',
        month: '',
        year: ''
    });

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const indianStates = [
        'Administrative unit not available districts (Jammu and Kashmir province)',
        'Ahmadabad',
        'Andaman Islands district (Andaman and Nicobar province)',
        'Andhra Pradesh',
        'Angul',
        'Anjar',
        'Arunachal Pradesh',
        'Assam',
        'Bengal',
        'Bezwada',
        'Bihar',
        'Bombay',
        'Brahmaputra',
        'Broach',
        'Cachemire',
        'Cashmire',
        'Central',
        'Central - Western',
        'Chadoora village (72811 district',
        'Chamoli',
        'Chhattisgarh',
        'Cuddalore',
        'Cuttack',
        'Dakshina Kannada and Udupi districts',
        'Delhi',
        'Dharmsala',
        'Doda',
        'East & West Godavari districts',
        'East coast',
        'Eastern',
        'Gajapati',
        'Ganges region',
        'Ganjam district (Orissa)',
        'Goa',
        'Godavari',
        'Gujarat',
        'Guntur (Madras)',
        'Haryana',
        'Himachal Pradesh',
        'Himachel Pradesh province',
        'Jammu',
        'Jammu & Kashmir state',
        'Jammu (Kashmir)',
        'Jammu and Kashmir',
        'Jammu and Kashmir (Administrative unit not available) (Siachen glacier)',
        'Jammu and Kashmir State',
        'Jammu and Kashmir province',
        'Jammu and Kashmir provinces',
        'Jammu region',
        'Kahool',
        'Kangra',
        'Kannaman',
        'Karnataka',
        'Kashmir',
        'Kashmir province',
        'Kendrapara district (Orissa province)',
        'Kerala',
        'Kolkata',
        'Kutch',
        'Ladakh area',
        'Lahaul',
        'Latur area',
        'Leh',
        'Madhya Pradesh',
        'Madras',
        'Madras City',
        'Madras city',
        'Madras state',
        'Maduri',
        'Maharashtra',
        'Mandi district',
        'Manipur',
        'Masarkal',
        'Meghalaya',
        'Midnapore',
        'Mizoram',
        'Mormugao',
        'Mumbai',
        'Mysore',
        'Nagaland',
        'Nationwide except south',
        'Nellore',
        'North',
        'North India',
        'North West',
        'North-East',
        'North-East region',
        'North-East states',
        'Northeast',
        'Northeastern',
        'Northern',
        'Odisha',
        'Oman Sea',
        'Orissa',
        'Orissa State',
        'Orissa province',
        'Orissa state',
        'Punjab',
        'Puri',
        'Rajasthan',
        'Rajputana',
        'Ramanathapurum',
        'Rameswaram',
        'Saurashtra',
        'Sikkim',
        'Sonamanrg (Ganderbal district)',
        'Southern India',
        'Srinagar',
        'Tami Nadu state',
        'Tamil Nadu',
        'Tanjore',
        'Telangana',
        'Tinsukia',
        'Tripura',
        'Unknown',
        'Uttar Pradesh',
        'Uttarakhand',
        'Valsad',
        'Vishakhapatam',
        'West',
        'West Bengal',
        'Western'
    ].sort(); // Sort alphabetically

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/predict-indian-disaster', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Prediction failed');
            }
            setPrediction(data);
        } catch (err) {
            setError(err.message);
            console.error('Prediction error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <Container>
                    <h1>ApadaMitra</h1>
                    <p>Advanced Disaster Prediction & Analysis System</p>
                </Container>
            </div>

            <Container className="dashboard-content">
                <div className="search-panel">
                    <Card>
                        <Card.Body>
                            <h4>Predict Natural Disasters</h4>
                            <p className="text-muted">Enter location and time period for prediction analysis</p>
                            
                            <Form onSubmit={handleSubmit}>
                                <Row className="search-inputs">
                                    <Col lg={4} md={6}>
                                        <Form.Group>
                                            <Form.Label>
                                                <i className="fas fa-map-marker-alt"></i> Location
                                            </Form.Label>
                                            <Form.Select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                                className="location-select"
                                            >
                                                <option value="">Select Region/State</option>
                                                {indianStates.map((state) => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col lg={4} md={6}>
                                        <Form.Group>
                                            <Form.Label>
                                                <i className="fas fa-calendar"></i> Month
                                            </Form.Label>
                                            <Form.Select
                                                name="month"
                                                value={formData.month}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Month</option>
                                                {months.map((month, index) => (
                                                    <option key={month} value={index + 1}>{month}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col lg={4} md={6}>
                                        <Form.Group>
                                            <Form.Label>
                                                <i className="fas fa-clock"></i> Year
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="year"
                                                value={formData.year}
                                                onChange={handleInputChange}
                                                placeholder="2025-2034"
                                                min="2025"
                                                max="2034"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="search-action">
                                    <Button 
                                        type="submit" 
                                        className="analyze-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-search me-2"></i>
                                                Analyze Risk
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                {error && (
                    <div className="alert-panel">
                        <div className="alert alert-danger">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            {error}
                        </div>
                    </div>
                )}

                {prediction && prediction.success && (
                    <div className="results-panel">
                        <div className="results-header">
                            <h3>
                                <i className="fas fa-chart-bar me-2"></i>
                                Disaster Risk Analysis
                            </h3>
                            <div className="results-meta">
                                <span><i className="fas fa-map-marker-alt"></i> {prediction.state}</span>
                                <span><i className="fas fa-calendar"></i> {prediction.month} {prediction.year}</span>
                            </div>
                        </div>

                        <Row className="prediction-cards">
                            {prediction.predictions.map((pred, index) => (
                                <Col lg={4} md={6} key={index}>
                                    <div className={`prediction-card ${getRiskClass(pred.probability)}`}>
                                        <div className="risk-badge">{getRiskLevel(pred.probability)}</div>
                                        <div className="disaster-icon">
                                            {getDisasterIcon(pred.type)}
                                        </div>
                                        <h4>{pred.type}</h4>
                                        
                                        <div className="risk-meter">
                                            <div 
                                                className="risk-fill" 
                                                style={{width: `${pred.probability}%`}}
                                            ></div>
                                            <span className="risk-percentage">{pred.probability}%</span>
                                        </div>

                                        <div className="prediction-details">
                                            <div className="detail-item">
                                                <i className="fas fa-cloud"></i>
                                                <span>{pred.climate_zone}</span>
                                            </div>
                                            <div className="detail-item">
                                                <i className="fas fa-sun"></i>
                                                <span>{pred.season}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </Container>
        </div>
    );
}

// Helper functions
function getRiskClass(probability) {
    if (probability > 70) return 'high-risk';
    if (probability > 40) return 'medium-risk';
    return 'low-risk';
}

function getRiskLevel(probability) {
    if (probability > 70) return 'High Risk';
    if (probability > 40) return 'Medium Risk';
    return 'Low Risk';
}

function getDisasterIcon(type) {
    const icons = {
        'Earthquake': '🌋',
        'Flood': '🌊',
        'Storm': '🌪️',
        'Drought': '☀️',
        'Extreme temperature': '🌡️',
        'Epidemic': '🦠',
        'Mass movement (wet)': '⛰️'
    };
    return icons[type] || '⚠️';
}

export default DisasterPrediction;