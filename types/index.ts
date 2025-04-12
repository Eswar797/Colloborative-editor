export interface User {
  id: string;
  username: string;
  color: string;
}

export interface CodeChange {
  userId: string;
  content: string;
  timestamp: number;
}

export interface CanvasObject {
  id: string;
  type: 'rect' | 'circle' | 'line' | 'text' | 'path';
  x: number;
  y: number;
  userId: string;
  [key: string]: any; // Additional properties based on object type
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  target: {
    type: 'code' | 'canvas';
    position: number | { x: number; y: number };
    objectId?: string;
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface CursorPosition {
  userId: string;
  username: string;
  color: string;
  x: number;
  y: number;
}

export interface CodeEditorCursor {
  userId: string;
  username: string;
  color: string;
  position: number;
} 