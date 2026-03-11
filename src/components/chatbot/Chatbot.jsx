import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import './Chatbot.css';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Farming Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(prev => !prev);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Simulate typing delay
        setTimeout(() => {
            const botResponse = generateResponse(userMsg.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const generateResponse = (inputText) => {
        const text = inputText.toLowerCase();
        if (text.includes('weather') || text.includes('rain')) {
            return "Based on the current forecasts, there is a 30% chance of rain tomorrow. I recommend checking the Weather Intelligence dashboard for detailed hourly data.";
        } else if (text.includes('disease') || text.includes('sick') || text.includes('spots')) {
            return "For potential crop diseases, you can upload a photo of the affected leaves in the Disease Detection module. It will quickly identify the issue and suggest treatments.";
        } else if (text.includes('water') || text.includes('irrigation')) {
            return "Soil moisture levels are currently optimal in Sector A, but Sector B might need watering soon. Head to the Irrigation Planner to adjust your schedule.";
        } else if (text.includes('price') || text.includes('market')) {
            return "Wheat prices have gone up by 2% today in the local market. Check the Market Insights page for a comprehensive trend analysis.";
        } else {
            return "I understand. As your AI assistant, I can help you with weather forecasts, crop disease detection, irrigation planning, or market prices. What area would you like to explore?";
        }
    };

    return (
        <div className="chatbot-wrapper">
            {/* Chatbot Toggle Button */}
            {!isOpen && (
                <button className="chatbot-toggle animate-bounce-sm" onClick={toggleChat} aria-label="Open Chat">
                    <MessageSquare size={24} />
                    <span className="tooltip-toggle">Ask AI</span>
                </button>
            )}

            {/* Chatbot Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : 'closed'}`}>
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar-container">
                            <Bot size={20} className="text-white" />
                            <span className="status-dot online indicator"></span>
                        </div>
                        <div>
                            <h3 className="chatbot-title">AI Assistant</h3>
                            <p className="chatbot-subtitle">Online</p>
                        </div>
                    </div>
                    <div className="chatbot-header-actions">
                        <button onClick={toggleChat} className="chatbot-action-btn">
                            <Minimize2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`chatbot-message-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                            {msg.sender === 'bot' && (
                                <div className="chatbot-message-avatar bot-avatar">
                                    <Bot size={14} />
                                </div>
                            )}
                            <div className={`chatbot-message-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chatbot-input-area">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="chatbot-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="chatbot-send-btn"
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
