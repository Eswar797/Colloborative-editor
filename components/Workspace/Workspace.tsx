'use client';

import { useState, useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import Compiler from '@/components/Compiler/Compiler';
import Canvas from '@/components/Canvas/Canvas';
import Chat from '@/components/Chat/Chat';
import UserList from '@/components/UserList/UserList';
import { User, ChatMessage } from '@/types';

interface WorkspaceProps {
  username: string;
}

export default function Workspace({ username }: WorkspaceProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'code' | 'canvas'>('code');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [code, setCode] = useState<string>('// Start typing your code here...');
  const [language, setLanguage] = useState<string>('javascript');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [outputVisible, setOutputVisible] = useState(true);

  useEffect(() => {
    const socket = getSocket();

    socket.on('users', (connectedUsers: User[]) => {
      setUsers(connectedUsers);
    });

    socket.on('chat_message', (message: ChatMessage) => {
      setChatMessages((prev) => [...prev, message]);
    });

    socket.on('code_update', (newCode: string) => {
      setCode(newCode);
    });

    socket.on('language_change', (newLanguage: string) => {
      setLanguage(newLanguage);
    });

    socket.on('code_execution_result', (output: string) => {
      // You could add logic here to display the output if needed
      // This is handled by the Compiler component
    });

    return () => {
      socket.off('users');
      socket.off('chat_message');
      socket.off('code_update');
      socket.off('language_change');
      socket.off('code_execution_result');
    };
  }, []);

  const sendMessage = (text: string) => {
    const socket = getSocket();
    socket.emit('chat_message', { text });
  };

  const updateCode = (newCode: string) => {
    const socket = getSocket();
    setCode(newCode);
    socket.emit('code_update', newCode);
  };

  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    // The emit happens in the CodeEditor component
  };

  const toggleOutput = () => {
    setOutputVisible(!outputVisible);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Collaborative Workspace</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 text-sm rounded-md ${
                activeTab === 'code'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Code Editor
            </button>
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1 text-sm rounded-md ${
                activeTab === 'canvas'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Canvas
            </button>
          </div>
        </div>
        <UserList users={users} />
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor/Canvas Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'code' ? (
            <>
              <div className="flex-1 overflow-hidden">
                <CodeEditor 
                  code={code} 
                  onChange={updateCode}
                  language={language}
                  onLanguageChange={updateLanguage}
                />
              </div>
              {outputVisible && (
                <div className="h-56">
                  <Compiler code={code} language={language} />
                </div>
              )}
              <button
                onClick={toggleOutput}
                className="absolute p-2 text-white bg-gray-700 rounded-full bottom-4 left-4"
              >
                {outputVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </>
          ) : (
            <Canvas />
          )}
        </div>

        {/* Chat sidebar */}
        {isChatOpen && (
          <div className="w-80 border-l border-gray-200 bg-white">
            <Chat messages={chatMessages} onSendMessage={sendMessage} username={username} />
          </div>
        )}

        {/* Chat toggle button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="absolute p-2 text-white bg-primary rounded-full bottom-4 right-4"
        >
          {isChatOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
} 