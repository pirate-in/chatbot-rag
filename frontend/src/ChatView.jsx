// ChatView.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { clearChatHistory } from './ChatHistory';
import { formatContent,codeBlockStyles  } from './code_formatter'
const ChatMessage = ({ message }) => {
    return (
        <div className="chat-message">
            <div className="message-sender">{message.sender}</div>
            <div
                className="message-content"
                dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
            />
        </div>
    );
};


const ChatView = ({ messages, setMessages, baseUrl, isTyping, setIsTyping }) => {
    
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = codeBlockStyles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputText.trim() === '') return;

        const userMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            await fetch(`${baseUrl}achat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: inputText })
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setIsTyping(false);
        }
    };

    const handleClearHistory = () => {
        if (window.confirm('Are you sure you want to clear the chat history?')) {
            setMessages([]);
            clearChatHistory();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        {message.sender === 'ai' && (
                            <Bot className="w-8 h-8 text-blue-500" />
                        )}
                        <div
                            className={`p-3 rounded-lg max-w-[70%] ${message.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-black'
                                }`}
                        >
                            {formatContent(message.text)}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <Bot className="w-6 h-6" />
                        <span>Analyzing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
                {messages.length > 0 && (
                    <div className="mb-2 flex justify-end">
                        <button
                            onClick={handleClearHistory}
                            className="text-red-500 text-sm hover:underline"
                        >
                            Clear Chat History
                        </button>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatView;