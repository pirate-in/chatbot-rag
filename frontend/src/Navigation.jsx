// Navigation.jsx
import React from 'react';
import { MessageCircle, FileUp, FileText } from 'lucide-react';

const Navigation = ({ activeNav, setActiveNav }) => {
  const navItems = [
    { id: 'chat', label: 'Chat', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'upload', label: 'Upload', icon: <FileUp className="w-5 h-5" /> },
    { id: 'library', label: 'Prompt Library', icon: <FileText className="w-5 h-5" /> },
    { id: 'prompt-execution-view', label: 'Prompt Execution', icon: null }
  ];

  return (
    <div className="w-64 bg-gray-100 border-r p-4 space-y-2">
      {navItems.map(item => (
        <button 
          key={item.id}
          onClick={() => setActiveNav(item.id)}
          className={`w-full flex items-center space-x-2 p-3 rounded transition ${
            activeNav === item.id 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-200 text-gray-700'
          }`}
        >
          {item.icon && item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;