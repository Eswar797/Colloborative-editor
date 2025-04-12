'use client';

import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { getSocket } from '@/lib/socket';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

export default function CodeEditor({ code, onChange, language, onLanguageChange }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);
  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' },
    { id: 'csharp', name: 'C#' },
    { id: 'go', name: 'Go' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'php', name: 'PHP' },
    { id: 'rust', name: 'Rust' },
  ];

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    // Set editor options
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
    });
  };

  useEffect(() => {
    const socket = getSocket();
    
    // Sync cursor position
    const interval = setInterval(() => {
      if (editorRef.current) {
        const position = editorRef.current.getPosition();
        if (position) {
          socket.emit('cursor_position', {
            type: 'code',
            position: editorRef.current.getModel().getOffsetAt(position)
          });
        }
      }
    }, 500);

    // Listen for other users' cursor positions
    socket.on('cursor_positions', (positions: any[]) => {
      // We would implement decoration rendering for cursors here
    });

    // Listen for language changes
    socket.on('language_change', (newLanguage: string) => {
      if (newLanguage !== language) {
        onLanguageChange(newLanguage);
      }
    });

    return () => {
      clearInterval(interval);
      socket.off('cursor_positions');
      socket.off('language_change');
    };
  }, [language, onLanguageChange]);
  
  const handleChange = (value: string | undefined) => {
    if (value !== undefined && !isUpdatingRef.current) {
      onChange(value);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    onLanguageChange(newLanguage);
    
    // Emit language change to other users
    const socket = getSocket();
    socket.emit('language_change', newLanguage);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center p-2 bg-gray-100">
        <select 
          value={language} 
          onChange={handleLanguageChange}
          className="p-1 border rounded text-sm"
        >
          {supportedLanguages.map(lang => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language={language}
          value={code}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          theme="vs-light"
          options={{
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
} 