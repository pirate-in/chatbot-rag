import React, { useState, useEffect } from 'react';
import { ChatHistorySidebar, styles as sidebarStyles } from './ChatHistorySidebar';
import ChatView from './ChatView'; // Your existing chat view component

const ChatApplication = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  
  // Load chat history from local storage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      setChatHistory(parsedHistory);
      
      // Set the most recent chat as active if available
      if (parsedHistory.length > 0) {
        const sortedChats = [...parsedHistory].sort(
          (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
        );
        setCurrentChatId(sortedChats[0].id);
      }
    }
  }, []);
  
  // Update current chat whenever currentChatId changes
  useEffect(() => {
    if (currentChatId) {
      const selectedChat = chatHistory.find(chat => chat.id === currentChatId);
      setCurrentChat(selectedChat || null);
    } else {
      setCurrentChat(null);
    }
  }, [currentChatId, chatHistory]);
  
  // Save chat history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);
  
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
  };
  
  // Delete a chat
  const handleDeleteChat = (chatId) => {
    setChatHistory(prevHistory => prevHistory.filter(chat => chat.id !== chatId));
    
    // If the deleted chat was the active one, select another chat or create a new one
    if (currentChatId === chatId) {
      const remainingChats = chatHistory.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id);
      } else {
        handleNewChat();
      }
    }
  };
  
  // Update a chat with new messages
  const updateChat = (chatId, newMessages) => {
    setChatHistory(prevHistory => 
      prevHistory.map(chat => 
        chat.id === chatId
          ? { ...chat, messages: newMessages, lastUpdated: new Date().toISOString() }
          : chat
      )
    );
  };
  
  // Add styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = sidebarStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <div className="chat-application">
      <ChatHistorySidebar
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      
      <div className="chat-main-area">
        {currentChat ? (
          <ChatView
            messages={currentChat.messages}
            onSendMessage={(newMessage) => {
              const updatedMessages = [...currentChat.messages, newMessage];
              updateChat(currentChatId, updatedMessages);
            }}
          />
        ) : (
          <div className="empty-state">
            <p>Select a chat or start a new conversation</p>
            <button onClick={handleNewChat}>New Chat</button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .chat-application {
          display: flex;
          height: 100vh;
        }
        
        .chat-main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
        }
        
        .empty-state button {
          margin-top: 16px;
          padding: 8px 16px;
          background: #10a37f;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ChatApplication;