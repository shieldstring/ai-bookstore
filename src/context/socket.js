import { io } from 'socket.io-client';
import { store } from '../store';
import { addNotification } from '../features/social/socialSlice';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket;

export const initSocket = () => {
  const { token } = store.getState().auth;
  
  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Handle connection events
  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  socket.on('connect_error', (err) => {
    console.log('Socket connection error:', err.message);
  });

  // Handle custom events
  socket.on('notification', (notification) => {
    store.dispatch(addNotification(notification));
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};