import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

function TweetRealTime() {
    const [tweet, setTweet] = useState('');
    const [prediction, setPrediction] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/predict-disaster', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tweet }),
            });
            const data = await response.json();
            setPrediction(data.prediction);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Natural Disaster Tweet Analysis</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Enter Tweet Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={tweet}
                        onChange={(e) => setTweet(e.target.value)}
                        placeholder="Enter tweet text here..."
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Analyze Tweet
                </Button>
            </Form>

            {prediction && (
                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Analysis Result</Card.Title>
                        <Card.Text>
                            Probability of Natural Disaster: {(prediction * 100).toFixed(2)}%
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default TweetRealTime; 