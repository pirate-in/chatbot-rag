import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Bot, MessageCircle,
  FileUp, X
} from 'lucide-react';

const ChatInterface = () => {
  const [activeNav, setActiveNav] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState({});
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // SSE Connection for Chat
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    // Establish SSE connection for chat
    const source = new EventSource('/achat/events');
    
    source.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: parsedData.message,
        sender: 'ai'
      }]);
    };

    source.onerror = (error) => {
      console.error('SSE Error:', error);
      source.close();
    };

    setEventSource(source);

    // Cleanup on component unmount
    return () => {
      if (source) source.close();
    };
  }, []);

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
      const response = await fetch('/achat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: inputText })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    // Track upload progress for each file
    newFiles.forEach(file => uploadFile(file));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Create a new XMLHttpRequest to track upload progress
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setFileProgress(prev => ({
          ...prev,
          [file.name]: percentComplete
        }));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        // Upload complete
        setFileProgress(prev => ({
          ...prev,
          [file.name]: 100
        }));
      } else {
        // Handle error
        console.error('Upload failed');
        setFileProgress(prev => ({
          ...prev,
          [file.name]: -1 // Error state
        }));
      }
    };

    xhr.open('POST', '/upload', true);
    xhr.send(formData);
  };

  const removeFile = (fileName) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    const { [fileName]: removed, ...remainingProgress } = fileProgress;
    setFileProgress(remainingProgress);
  };

  const renderContent = () => {
    if (activeNav === 'chat') {
      return (
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <Bot className="w-8 h-8 text-blue-500" />
                )}
                <div 
                  className={`p-3 rounded-lg max-w-[70%] ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Bot className="w-6 h-6" />
                <span>Typing...</span>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t flex items-center space-x-2">
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
      );
    }

    if (activeNav === 'upload') {
      return (
        <div className="p-6">
          <div 
            className="border-2 border-dashed p-10 text-center cursor-pointer hover:bg-gray-100"
            onClick={() => fileInputRef.current.click()}
          >
            <FileUp className="mx-auto w-12 h-12 text-blue-500 mb-4" />
            <p>Drag and drop files here or click to upload</p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
              {files.map(file => (
                <div 
                  key={file.name} 
                  className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg mb-2"
                >
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <span>{file.name}</span>
                      <span>
                        {fileProgress[file.name] !== undefined 
                          ? `${fileProgress[file.name]}%` 
                          : 'Queued'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          fileProgress[file.name] === 100 
                            ? 'bg-green-500' 
                            : fileProgress[file.name] === -1 
                            ? 'bg-red-500' 
                            : 'bg-blue-600'
                        }`}
                        style={{ 
                          width: `${fileProgress[file.name] || 0}%`,
                          transition: 'width 0.5s ease-in-out'
                        }}
                      ></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(file.name)}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <div className="w-16 bg-gray-100 border-r flex flex-col items-center py-4">
        <button 
          onClick={() => setActiveNav('chat')}
          className={`p-3 ${activeNav === 'chat' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveNav('upload')}
          className={`p-3 ${activeNav === 'upload' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <FileUp className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {activeNav === 'chat' ? 'Chat' : 'Upload Files'}
          </h1>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-grow overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;