import React, { useState } from 'react';

// Icons for the sidebar
const NewChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ChatBubbleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

// Helper function for date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Helper function for time formatting
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

const ChatHistorySidebar = ({ 
  chatHistory,
  currentChatId, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat 
}) => {
  const [hoveredChatId, setHoveredChatId] = useState(null);

  // Group chats by date
  const groupedChats = chatHistory.reduce((groups, chat) => {
    const formattedDate = formatDate(chat.lastUpdated);
    
    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }
    
    groups[formattedDate].push(chat);
    return groups;
  }, {});

  // Get a preview of the first message or use default text
  const getChatPreview = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
      const firstMessage = chat.messages[0].text || 'New conversation';
      return firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
    }
    return 'New conversation';
  };

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <button className="new-chat-button" onClick={onNewChat}>
          <NewChatIcon />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="chat-history-list">
        {Object.entries(groupedChats).map(([date, chats]) => (
          <div key={date} className="chat-group">
            <div className="date-divider">{date}</div>
            
            {chats.map(chat => (
              <div 
                key={chat.id} 
                className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                onClick={() => onSelectChat(chat.id)}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
              >
                <div className="chat-icon">
                  <ChatBubbleIcon />
                </div>
                
                <div className="chat-details">
                  <div className="chat-preview">{getChatPreview(chat)}</div>
                  <div className="chat-time">{formatTime(chat.lastUpdated)}</div>
                </div>
                
                {hoveredChatId === chat.id && (
                  <button 
                    className="delete-chat-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// CSS styles for the sidebar
const styles = `
.chat-sidebar {
  display: flex;
  flex-direction: column;
  background-color: #252c3a;
  height: 100%;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #374151;
}

.new-chat-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.new-chat-button:hover {
  background: #2563eb;
}

.chat-history-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
}

.chat-group {
  margin-bottom: 16px;
}

.date-divider {
  font-size: 12px;
  color: #9ca3af;
  padding: 0 16px 8px;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
}

.chat-item:hover {
  background-color: #374151;
}

.chat-item.active {
  background-color: #3b82f6;
}

.chat-icon {
  color: #9ca3af;
  margin-right: 12px;
}

.chat-item.active .chat-icon,
.chat-item.active .chat-time,
.chat-item.active .chat-preview {
  color: white;
}

.chat-details {
  flex: 1;
  min-width: 0;
}

.chat-preview {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #e5e7eb;
}

.chat-time {
  font-size: 12px;
  color: #9ca3af;
}

.delete-chat-button {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
}

.delete-chat-button:hover {
  color: #ef4444;
}
`;

export { ChatHistorySidebar, styles };