// useEventSource.js
import { useState, useEffect } from 'react';

export const useEventSource = (url, onMessage) => {
  const [eventSource, setEventSource] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const source = new EventSource(url);
    source.timeout = 30000;
    
    source.onopen = () => {
      console.log('SSE connection opened');
      setIsConnected(true);
    };
    
    source.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        onMessage(parsedData);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };
    
    source.onerror = (error) => {
      console.error('SSE Error:', error);
      setIsConnected(false);
      if (source.readyState === EventSource.CLOSED) {
        console.error("Connection closed by the server");
      } else if (source.readyState === EventSource.CONNECTING) {
        console.error("Reconnecting...");
      }
    };
    
    setEventSource(source);
    
    return () => {
      if (source) {
        source.close();
        setIsConnected(false);
      }
    };
  }, [url, onMessage]);
  
  return { isConnected };
};