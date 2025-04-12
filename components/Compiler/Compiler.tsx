'use client';

import { useState } from 'react';
import { getSocket } from '@/lib/socket';

interface CompilerProps {
  code: string;
  language: string;
}

export default function Compiler({ code, language }: CompilerProps) {
  const [output, setOutput] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to run the code
  const runCode = async () => {
    setIsCompiling(true);
    setError(null);
    
    try {
      // Simple client-side simulation for demo purposes
      await simulateExecution(code, language);
    } catch (err: any) {
      setError(err.message || 'Error running code');
      console.error(err);
    } finally {
      setIsCompiling(false);
    }
  };

  // Simulates code execution locally
  const simulateExecution = async (code: string, language: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!code.trim()) {
      setError('Error: Empty code submission');
      return;
    }
    
    let result = '';
    
    // Provide language-specific sample outputs
    switch (language) {
      case 'javascript':
        if (code.includes('console.log')) {
          const match = code.match(/console\.log\(['"](.+)['"]\)/);
          result = match ? match[1] : 'Hello from JavaScript!';
        } else {
          result = 'JavaScript code executed successfully.';
        }
        break;
        
      case 'python':
        if (code.includes('print')) {
          const match = code.match(/print\(['"](.+)['"]\)/);
          result = match ? match[1] : 'Hello from Python!';
        } else {
          result = 'Python code executed successfully.';
        }
        break;
        
      case 'java':
        result = 'Java code compiled and executed successfully.';
        break;
        
      case 'cpp':
        result = 'C++ code compiled and executed successfully.';
        break;
        
      default:
        result = `${language} code executed successfully.`;
    }
    
    setOutput(result);
    
    // Share the output with other users
    const socket = getSocket();
    socket.emit('code_execution_result', result);
  };

  return (
    <div className="border-t">
      <div className="p-2 bg-gray-100 flex justify-between items-center">
        <h3 className="font-medium text-sm">Output</h3>
        <button 
          onClick={runCode}
          disabled={isCompiling}
          className={`px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 
            ${isCompiling ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isCompiling ? 'Running...' : 'Run Code'}
        </button>
      </div>
      
      <div className="p-3 bg-gray-900 text-white font-mono text-sm h-48 overflow-auto">
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : output ? (
          <pre>{output}</pre>
        ) : (
          <div className="text-gray-400">Click "Run Code" to see the output</div>
        )}
      </div>
    </div>
  );
} 