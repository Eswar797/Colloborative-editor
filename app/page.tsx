'use client';

import { useEffect, useState } from 'react';
import Workspace from '@/components/Workspace/Workspace';
import { initializeSocket } from '@/lib/socket';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [username, setUsername] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  // Generate a temporary user ID and get a username on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId') || uuidv4();
    localStorage.setItem('userId', userId);
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      initializeSocket(username);
      setHasJoined(true);
    }
  };

  if (!hasJoined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Collaborative App</h1>
            <p className="mt-2 text-gray-600">Real-time code editor and visual canvas</p>
          </div>
          <form onSubmit={handleJoin} className="mt-8 space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Enter your name
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Join Workspace
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return <Workspace username={username} />;
} 