import { useEffect, useState } from 'react';

const WEBSOCKET_URL = 'ws://localhost:3000/radio/ws';

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Send a join message
      const joinMessage = JSON.stringify({
        type: 'JOIN',
        channel: 'ALPHA-OPS'
      });
      ws.send(joinMessage);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'MESSAGE') {
          setMessages(prev => [...prev, {
            sender: data.sender,
            content: data.content
          }]);
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (content: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: 'MESSAGE',
        channel: 'ALPHA-OPS',
        content,
        sender: 'USER'
      });
      socket.send(message);
    }
  };

  return {
    messages,
    isConnected,
    sendMessage
  };
};