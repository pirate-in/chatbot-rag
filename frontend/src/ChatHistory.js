// ChatHistory.js
const STORAGE_KEY = 'chatHistory';

export const loadChatHistory = () => {
  try {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
};

export const saveChatHistory = (messages) => {
  if (messages && messages.length > 0) {
    try {
      const currentSaved = localStorage.getItem(STORAGE_KEY);
      const currentMessages = currentSaved ? JSON.parse(currentSaved) : [];
      
      // Only save if the messages are different from what's already saved
      if (JSON.stringify(messages) !== JSON.stringify(currentMessages)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }
};

export const clearChatHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
};