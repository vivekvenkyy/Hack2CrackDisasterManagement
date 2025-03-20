import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import { FaPaperPlane, FaRobot, FaUser, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import './MentalHealth.css';

function MentalHealth() {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [micEnabled, setMicEnabled] = useState(true); // Toggle for mic
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = (event) => console.error('Speech recognition error:', event.error);

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setCurrentMessage(transcript);
            };

            recognitionRef.current = recognition;
        } else {
            console.warn('Speech Recognition is not supported in this browser.');
        }
    }, []);

    const handleMicrophoneClick = () => {
        if (!micEnabled) return; // Disable mic functionality if mic is turned off

        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    const toggleMic = () => {
        setMicEnabled(!micEnabled);
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentMessage.trim()) return;

        const userMessage = { text: currentMessage, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "deepseek-mentalhealth",
                    messages: [
                        { role: "system", content: "You're a warm and understanding chatbot..." },
                        { role: "user", content: currentMessage }
                    ],
                    stream: false
                })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const botResponse = data.message?.content || data.response;
            const cleanedResponse = botResponse?.replace(/<think>.*?<\/think>/s, '').trim() || "I'm having trouble responding.";
            
            setMessages(prev => [...prev, { text: cleanedResponse, sender: 'bot' }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { text: 'I apologize, but I am having trouble connecting. Please try again.', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mental-health-page">
            <Container className="mental-health-container">
                <Card className="chat-card shadow-lg">
                    <Card.Header className="chat-header">
                        <h2>Mental Health Support</h2>
                        <p>Your safe space to talk about mental health</p>
                        <Button 
                            variant={micEnabled ? "danger" : "secondary"} 
                            onClick={toggleMic} 
                            className="mic-toggle"
                        >
                            {micEnabled ? <FaMicrophoneSlash /> : <FaMicrophone />} 
                            {micEnabled ? " Disable Mic" : " Enable Mic"}
                        </Button>
                    </Card.Header>
                    
                    <Card.Body className="chat-body">
                        <div className="chat-messages">
                            {messages.length === 0 && (
                                <div className="welcome-message">
                                    <FaRobot size={40} />
                                    <h3>Welcome to Mental Health Support</h3>
                                    <p>Feel free to share your thoughts. I'm here to listen and support you.</p>
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <div key={index} className={`message-wrapper ${message.sender}-wrapper`}>
                                    <div className="message-icon">
                                        {message.sender === 'bot' ? <FaRobot /> : <FaUser />}
                                    </div>
                                    <div className={`message ${message.sender}-message`}>
                                        <div className="message-content">{message.text}</div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message-wrapper bot-wrapper">
                                    <FaRobot />
                                    <div className="message bot-message">
                                        <div className="message-content typing-indicator">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <Form onSubmit={handleSubmit} className="chat-input-form">
                            <div className="input-group">
                                <Button 
                                    onClick={handleMicrophoneClick} 
                                    className={`mic-button ${isListening ? 'active' : ''}`} 
                                    disabled={!micEnabled}
                                >
                                    {micEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
                                </Button>
                                <Form.Control
                                    type="text"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    disabled={isLoading}
                                />
                                <Button type="submit" className="send-button" disabled={isLoading || !currentMessage.trim()}>
                                    {isLoading ? <Spinner animation="border" size="sm" /> : <FaPaperPlane />}
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
