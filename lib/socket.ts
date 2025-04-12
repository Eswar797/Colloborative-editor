import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initializeSocket = (username: string) => {
  // For static export, we'll need to use a fallback server
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://collaborative-socket-server.herokuapp.com';
  
  socket = io(socketUrl, {
    path: '/socket.io',
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