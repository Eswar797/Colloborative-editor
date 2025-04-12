import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketNextApiResponse {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
}

// Store data in memory
let users: any[] = [];
let code = '// Start typing your code here...';
let language = 'javascript';
let canvasObjects: any[] = [];
let chatMessages: any[] = [];
let lastExecutionResult = '';

// Assign a random color to new users
const colors = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33',
  '#33FFF5', '#FF3333', '#33FF33', '#3333FF', '#FF33FF'
];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export default function SocketHandler(_: NextApiRequest, res: SocketNextApiResponse) {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      // Extract username from query
      const { username } = socket.handshake.query;
      
      // Create user object
      const user = {
        id: socket.id,
        username: username || 'Anonymous',
        color: getRandomColor(),
      };
      
      // Add user to list
      users.push(user);
      
      // Send current state to the new user
      socket.emit('users', users);
      socket.emit('code_update', code);
      socket.emit('language_change', language);
      socket.emit('canvas_update', canvasObjects);
      socket.emit('chat_messages', chatMessages);
      if (lastExecutionResult) {
        socket.emit('code_execution_result', lastExecutionResult);
      }
      
      // Broadcast to others that a new user joined
      socket.broadcast.emit('users', users);
      socket.broadcast.emit('chat_message', {
        id: uuidv4(),
        userId: 'system',
        username: 'System',
        text: `${user.username} joined the workspace`,
        timestamp: Date.now(),
      });

      // Code editor events
      socket.on('code_update', (newCode) => {
        code = newCode;
        socket.broadcast.emit('code_update', code);
      });

      // Language change events
      socket.on('language_change', (newLanguage) => {
        language = newLanguage;
        socket.broadcast.emit('language_change', language);
      });

      // Code execution results
      socket.on('code_execution_result', (result) => {
        lastExecutionResult = result;
        socket.broadcast.emit('code_execution_result', result);
      });

      socket.on('cursor_position', (position) => {
        const cursorData = {
          userId: socket.id,
          username: user.username,
          color: user.color,
          ...position,
        };
        socket.broadcast.emit('cursor_positions', [cursorData]);
      });

      // Canvas events
      socket.on('canvas_object_added', (object) => {
        canvasObjects.push(object);
        socket.broadcast.emit('canvas_object_added', object);
      });

      socket.on('canvas_object_updated', (object) => {
        const index = canvasObjects.findIndex(obj => obj.id === object.id);
        if (index !== -1) {
          canvasObjects[index] = object;
          socket.broadcast.emit('canvas_object_updated', object);
        }
      });

      socket.on('canvas_object_removed', (objectId) => {
        canvasObjects = canvasObjects.filter(obj => obj.id !== objectId);
        socket.broadcast.emit('canvas_object_removed', objectId);
      });

      socket.on('canvas_cleared', () => {
        canvasObjects = [];
        io.emit('canvas_update', canvasObjects);
      });

      // Chat events
      socket.on('chat_message', (messageData) => {
        const message = {
          id: uuidv4(),
          userId: socket.id,
          username: user.username,
          text: messageData.text,
          timestamp: Date.now(),
        };
        
        chatMessages.push(message);
        io.emit('chat_message', message);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        users = users.filter(u => u.id !== socket.id);
        socket.broadcast.emit('users', users);
        socket.broadcast.emit('chat_message', {
          id: uuidv4(),
          userId: 'system',
          username: 'System',
          text: `${user.username} left the workspace`,
          timestamp: Date.now(),
        });
      });
    });

    res.socket.server.io = io;
  }
  
  res.end();
} 