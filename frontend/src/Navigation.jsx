import React from 'react';
import { ChatHistorySidebar } from './ChatHistorySidebar';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const Navigation = ({
  activeNav,
  setActiveNav,
  chatHistory = [],
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat
}) => {
  // Group 1: Chat
  const chatGroup = [
    { id: 'chat', label: 'Chat' }
  ];

  // Group 2: Upload
  const uploadGroup = [
    { id: 'upload', label: 'Upload Files' }
  ];

  // Group 3: Chat History (rendered conditionally when activeNav is 'chat')
  const chatHistoryGroup = [
    { id: 'chat-history', label: 'Chat History' }
  ];

  // Group 4: RAG
  const ragGroup = [
    { id: 'rag-system', label: 'Build RAG System' }
  ];

  // Group 5: Miscellaneous
  const miscellaneousGroup = [
    { id: 'library', label: 'Prompt Library' },
    { id: 'prompt-execution-view', label: 'Prompt Execution' }
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white h-full">
      {/* Group 1: Chat */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Chat</h2>
        <ul>
          {chatGroup.map(item => (
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

      {/* Group 2: Upload */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Upload</h2>
        <ul>
          {uploadGroup.map(item => (
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

      {/* Group 3: Chat History (Conditional Rendering) */}
      {activeNav === 'chat' && (
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Chat History</h2>
          <div className="flex-grow overflow-hidden">
            <ChatHistorySidebar
              chatHistory={chatHistory}
              currentChatId={currentChatId}
              onSelectChat={onSelectChat}
              onNewChat={onNewChat}
              onDeleteChat={onDeleteChat}
            />
          </div>
        </div>
      )}

      {/* Group 4: RAG */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold mb-4">RAG</h2>
        <ul>
          {ragGroup.map(item => (
            <li key={item.id} className="mb-2">
              <Link
                to={`/${item.id}`}
                className={`block py-2 px-4 rounded ${
                  activeNav === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => setActiveNav(item.id)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Group 5: Miscellaneous */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Miscellaneous</h2>
        <ul>
          {miscellaneousGroup.map(item => (
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
    </div>
  );
};

export default Navigation;