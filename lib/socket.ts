import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initializeSocket = (username: string) => {
  socket = io('/', {
    path: '/api/socketio',
    query: { username }
  });

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
}; 