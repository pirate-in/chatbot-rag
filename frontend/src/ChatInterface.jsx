// ChatInterface.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { loadChatHistory, saveChatHistory } from './ChatHistory';
import { useEventSource } from './useEventSource';
import Navigation from './Navigation';
import ChatView from './ChatView';
import FileUploader from './FileUploader';
import { PromptLibrary } from './prompt-library';
import PromptExecutionView from './prompt_execution_view';
import { styles as sidebarStyles } from './ChatHistorySidebar';

const ChatInterface = () => {
  const [activeNav, setActiveNav] = useState('chat');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const BASE_URL = "http://localhost:8000/";
  
  // Load chat history on initial render
  useEffect(() => {
    const savedHistory = loadChatHistory();
    if (savedHistory && savedHistory.length > 0) {
      setChatHistory(savedHistory);
      // Set most recent chat as active
      const sortedChats = [...savedHistory].sort(
        (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
      );
      setCurrentChatId(sortedChats[0].id);
      setMessages(sortedChats[0].messages || []);
    } else {
      // Create a new chat if no history exists
      handleNewChat();
    }
  }, []); // Empty dependency array means this runs only once

  // Memoize the message handler to prevent recreation on each render
  const handleIncomingMessage = useCallback((parsedData) => {
    const newMessage = {
      id: Date.now(),
      text: parsedData.message,
      sender: 'ai'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);
    
    // Update current chat in history
    if (currentChatId) {
      updateChatWithMessage(currentChatId, newMessage);
    }
  }, [currentChatId]);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      saveChatHistory(chatHistory);
    }
  }, [chatHistory]);

  // Connect to SSE
  const { isConnected } = useEventSource(
    `${BASE_URL}achat/events`,
    handleIncomingMessage
  );

  // Add sidebar styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = sidebarStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Create a new chat
  const handleNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    const newChat = {
      id: newChatId,
      lastUpdated: new Date().toISOString(),
      messages: []
    };
    
    setChatHistory(prevHistory => [newChat, ...prevHistory]);
    setCurrentChatId(newChatId);
    setMessages([]);
  };
  
  // Delete a chat
  const handleDeleteChat = (chatId) => {
    setChatHistory(prevHistory => prevHistory.filter(chat => chat.id !== chatId));
    
    // If the deleted chat was the active one, select another chat or create a new one
    if (currentChatId === chatId) {
      const remainingChats = chatHistory.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id);
        setMessages(remainingChats[0].messages || []);
      } else {
        handleNewChat();
      }
    }
  };
  
  // Update a chat with new message
  const updateChatWithMessage = (chatId, newMessage) => {
    setChatHistory(prevHistory => 
      prevHistory.map(chat => 
        chat.id === chatId
          ? { 
              ...chat, 
              messages: [...(chat.messages || []), newMessage], 
              lastUpdated: new Date().toISOString() 
            }
          : chat
      )
    );
  };
  
  // Handle selecting a chat
  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    setMessages(selectedChat?.messages || []);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'chat':
        return (
          <ChatView 
            messages={messages} 
            setMessages={(newMessages) => {
              setMessages(newMessages);
              // Update current chat in history when messages change
              if (currentChatId && newMessages.length > 0) {
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.sender === 'human') {
                  updateChatWithMessage(currentChatId, lastMessage);
                }
              }
            }} 
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
        {/* Left Navigation with Chat History */}
        <Navigation 
          activeNav={activeNav} 
          setActiveNav={setActiveNav} 
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
        
        {/* Main Content Area */}
        <div className="flex-grow overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;