import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import './MentalHealth.css';

function MentalHealth() {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const cleanResponse = (text) => {
        // Remove the thinking process enclosed in <think> tags
        return text.replace(/<think>.*?<\/think>/s, '').trim();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentMessage.trim()) return;

        setError(null);
        const userMessage = { text: currentMessage, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        setIsLoading(true);

        try {
            console.log('Sending request to Ollama...');
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: "deepseek-mentalhealth",
                    messages: [
                        {
                            role: "system",
                            content: "You are a compassionate mental health support assistant. Provide empathetic, supportive responses while maintaining appropriate boundaries and encouraging professional help when needed. Respond directly without showing your thinking process."
                        },
                        {
                            role: "user",
                            content: currentMessage
                        }
                    ],
                    stream: false
                })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            // Clean the response before displaying
            const cleanedResponse = cleanResponse(data.message?.content || data.response);
            
            const botMessage = { 
                text: cleanedResponse, 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error('Error details:', error);
            setError(error.message || 'Failed to get response from the AI model');
            const errorMessage = { 
                text: 'Sorry, I encountered an error. Please try again.', 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mental-health-page">
            <Container className="mental-health-container">
                <Card className="chat-card shadow-lg">
                    <Card.Header className="chat-header">
                        <div className="header-content">
                            <h2>Mental Health Support</h2>
                            <p>Your safe space to talk about mental health</p>
                        </div>
                    </Card.Header>
                    
                    <Card.Body className="chat-body">
                        <div className="chat-messages" id="chat-container">
                            {messages.length === 0 && (
                                <div className="welcome-message">
                                    <div className="welcome-icon">
                                        <FaRobot size={40} />
                                    </div>
                                    <h3>Welcome to Mental Health Support</h3>
                                    <p>Feel free to share your thoughts or concerns. 
                                       I'm here to listen and support you.</p>
                                    <div className="suggested-messages">
                                        <Button 
                                            variant="outline-primary" 
                                            onClick={() => setCurrentMessage("I'm feeling anxious")}
                                        >
                                            I'm feeling anxious
                                        </Button>
                                        <Button 
                                            variant="outline-primary"
                                            onClick={() => setCurrentMessage("I need someone to talk to")}
                                        >
                                            I need someone to talk to
                                        </Button>
                                        <Button 
                                            variant="outline-primary"
                                            onClick={() => setCurrentMessage("How can I improve my mental health?")}
                                        >
                                            How can I improve my mental health?
                                        </Button>
                                    </div>
                                </div>
                            )}
                            
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message-wrapper ${message.sender}-wrapper`}
                                >
                                    <div className="message-icon">
                                        {message.sender === 'bot' ? 
                                            <FaRobot /> : 
                                            <FaUser />
                                        }
                                    </div>
                                    <div className={`message ${message.sender}-message`}>
                                        <div className="message-content">
                                            {message.text}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="message-wrapper bot-wrapper">
                                    <div className="message-icon">
                                        <FaRobot />
                                    </div>
                                    <div className="message bot-message">
                                        <div className="message-content typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <Form onSubmit={handleSubmit} className="chat-input-form">
                            <div className="input-group">
                                <Form.Control
                                    type="text"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    disabled={isLoading}
                                    className="chat-input"
                                />
                                <Button 
                                    type="submit" 
                                    className="send-button"
                                    disabled={isLoading || !currentMessage.trim()}
                                >
                                    {isLoading ? (
                                        <Spinner 
                                            animation="border" 
                                            size="sm" 
                                            role="status"
                                        />
                                    ) : (
                                        <FaPaperPlane />
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default MentalHealth;