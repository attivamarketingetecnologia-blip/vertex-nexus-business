import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketEvent } from '../types/kanban';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  lastMessage: SocketEvent | null;
  sendEvent: (event: Omit<SocketEvent, 'timestamp'>) => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Mock WebSocket URL - replace with actual in production
const SOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<SocketEvent | null>(null);

  const connect = useCallback(() => {
    console.log('Connecting to WebSocket server...');
    
    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected:', newSocket.id);
      setIsConnected(true);
      
      // Join kanban room
      newSocket.emit('join-room', 'kanban-board');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('WebSocket reconnection attempt:', attemptNumber);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed');
    });

    // Listen for kanban events
    newSocket.on('kanban-event', (event: SocketEvent) => {
      console.log('Received kanban event:', event);
      setLastMessage(event);
    });

    newSocket.on('task-moved', (event: SocketEvent) => {
      console.log('Task moved:', event);
      setLastMessage(event);
    });

    newSocket.on('task-updated', (event: SocketEvent) => {
      console.log('Task updated:', event);
      setLastMessage(event);
    });

    newSocket.on('history-added', (event: SocketEvent) => {
      console.log('History added:', event);
      setLastMessage(event);
    });

    newSocket.on('notification', (event: SocketEvent) => {
      console.log('Notification:', event);
      setLastMessage(event);
    });

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up WebSocket connection');
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  const sendEvent = useCallback((event: Omit<SocketEvent, 'timestamp'>) => {
    if (!socket || !isConnected) {
      console.warn('Cannot send event: WebSocket not connected');
      return;
    }

    const fullEvent: SocketEvent = {
      ...event,
      timestamp: new Date(),
    };

    console.log('Sending event:', fullEvent);
    socket.emit('kanban-event', fullEvent);
  }, [socket, isConnected]);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
    connect();
  }, [socket, connect]);

  const value = {
    socket,
    isConnected,
    lastMessage,
    sendEvent,
    reconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

// Mock WebSocket server for development
export const mockWebSocketServer = {
  start: () => {
    console.log('Mock WebSocket server started');
    
    // Simulate incoming events
    const simulateEvent = () => {
      const events: SocketEvent[] = [
        {
          type: 'task-moved',
          data: {
            taskId: `task-${Math.floor(Math.random() * 1000)}`,
            agentName: ['VERTEX Core', 'Data Processor', 'ML Predictor'][Math.floor(Math.random() * 3)],
            fromColumn: 'todo',
            toColumn: 'in-progress',
          },
          timestamp: new Date(),
        },
        {
          type: 'notification',
          data: {
            title: 'Task Completed',
            message: 'Agent "Data Processor" completed task "Data Pipeline Optimization"',
          },
          timestamp: new Date(),
        },
        {
          type: 'history-added',
          data: {
            movement: {
              taskId: `task-${Math.floor(Math.random() * 1000)}`,
              fromColumn: 'in-progress',
              toColumn: 'review',
            },
          },
          timestamp: new Date(),
        },
      ];

      return events[Math.floor(Math.random() * events.length)];
    };

    // Return mock event emitter
    return {
      emit: (event: string, data: any) => {
        console.log(`Mock server received: ${event}`, data);
      },
      on: (event: string, callback: (data: any) => void) => {
        if (event === 'kanban-event') {
          // Simulate receiving events every 10-30 seconds
          const interval = setInterval(() => {
            const mockEvent = simulateEvent();
            callback(mockEvent);
          }, 10000 + Math.random() * 20000);

          return () => clearInterval(interval);
        }
      },
    };
  },
};