// ChatInterface.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { loadChatHistory, saveChatHistory } from './ChatHistory';
import { useEventSource } from './useEventSource';
import Navigation from './Navigation';
import ChatView from './ChatView';
import FileUploader from './FileUploader';
import { PromptLibrary } from './prompt-library';
import PromptExecutionView from './prompt_execution_view';

const ChatInterface = () => {
  const [activeNav, setActiveNav] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const BASE_URL = "http://localhost:8000/";

  // Load chat history on initial render ONLY
  useEffect(() => {
    const savedMessages = loadChatHistory();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []); // Empty dependency array means this runs only once

  // Memoize the message handler to prevent recreation on each render
  const handleIncomingMessage = useCallback((parsedData) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: parsedData.message,
      sender: 'ai'
    }]);
    setIsTyping(false);
  }, []);

  // Save messages to localStorage (with a check to prevent unnecessary saves)
  useEffect(() => {
    // Skip initial empty messages array
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Connect to SSE
  const { isConnected } = useEventSource(
    `${BASE_URL}achat/events`,
    handleIncomingMessage
  );

  const renderContent = () => {
    switch (activeNav) {
      case 'chat':
        return (
          <ChatView 
            messages={messages} 
            setMessages={setMessages} 
            baseUrl={BASE_URL}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
          />
        );
      case 'upload':
        return <FileUploader baseUrl={BASE_URL} />;
      case 'library':
        return <PromptLibrary />;
      case 'prompt-execution-view':
        return <PromptExecutionView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-xl font-bold shadow-md">
        AI Assistant
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Left Navigation */}
        <Navigation activeNav={activeNav} setActiveNav={setActiveNav} />
        
        {/* Main Content Area */}
        <div className="flex-grow overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;