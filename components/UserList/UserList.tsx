'use client';

import { User } from '@/types';

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <div className="relative">
      <button className="flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-gray-100">
        <span className="text-sm font-medium">{users.length} online</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      </button>
      
      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 hidden group-hover:block">
        {users.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-500">No users online</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="px-4 py-2 flex items-center space-x-2 hover:bg-gray-50">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: user.color }}
              />
              <span className="text-sm">{user.username}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 