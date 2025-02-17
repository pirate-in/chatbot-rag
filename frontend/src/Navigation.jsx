// Navigation.jsx
import React, { useState } from 'react';
import { ChatHistorySidebar } from './ChatHistorySidebar';

const Navigation = ({ 
  activeNav, 
  setActiveNav,
  chatHistory = [],
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat
}) => {
  const navItems = [
    { id: 'chat', label: 'Chat' },
    { id: 'upload', label: 'Upload Files' },
    { id: 'library', label: 'Prompt Library' },
    { id: 'prompt-execution-view', label: 'Prompt Execution' }
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      {/* Main Navigation */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
        <ul>
          {navItems.map(item => (
            <li key={item.id} className="mb-2">
              <button
                className={`w-full text-left py-2 px-4 rounded ${
                  activeNav === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => setActiveNav(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Chat History Sidebar - Only show when on chat view */}
      {activeNav === 'chat' && (
        <div className="flex-grow overflow-hidden">
          <ChatHistorySidebar
            chatHistory={chatHistory}
            currentChatId={currentChatId}
            onSelectChat={onSelectChat}
            onNewChat={onNewChat}
            onDeleteChat={onDeleteChat}
          />
        </div>
      )}
    </div>
  );
};

export default Navigation;