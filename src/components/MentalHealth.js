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

        const userMessage = { text: currentMessage, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        setIsLoading(true);

        try {
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
                            content: "You are a warm and understanding chatbot designed to engage in natural conversations. Begin chats normally without assuming anything about the user's emotions. If a user explicitly mentions feeling sad, depressed, or needing mental support, respond with reassurance: 'Thank you for reaching out. I'm here for you. Healing is a process that takes time, and it's okay to feel what you need in the moments after a disaster. You're not alone—there are people who care deeply about you and want to support you through this.After offering this initial reassurance, gently ask what happened and listen attentively. Respond based on their specific situation, providing comfort and understanding rather than immediate coping suggestions. Keep the conversation natural, engaging, and empathetic.Your goal is to support people who have experienced trauma from natural disasters or are struggling with depression. Respond empathetically, using positive and reassuring language. Avoid giving medical diagnoses or medication advice. Always encourage seeking professional or community support. If a user expresses thoughts of self-harm, gently urge them to contact a crisis helpline or a trusted person."
                        },
                        {
                            role: "user",
                            content: currentMessage
                        }
                    ],
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data || (!data.message && !data.response)) {
                throw new Error('Invalid response from server');
            }

            const botResponse = data.message?.content || data.response;
            if (!botResponse) {
                throw new Error('No response content received');
            }

            // Clean the response and add it to messages
            const cleanedResponse = botResponse.replace(/<think>.*?<\/think>/s, '').trim();
            
            const botMessage = { 
                text: cleanedResponse || "I apologize, but I'm having trouble formulating a response. Could you please rephrase your message?", 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error('Chat Error:', error);
            // Only add error message if it's not already the last message
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.text !== 'Sorry, I encountered an error. Please try again.') {
                    return [...prev, {
                        text: 'I apologize, but I am having trouble connecting. Please try again in a moment.',
                        sender: 'bot'
                    }];
                }
                return prev;
            });
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