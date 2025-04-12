import { NextResponse } from 'next/server';

// Define language-specific execution details
const languageHandlers: Record<string, (code: string) => Promise<string>> = {
  // In a production environment, you'd use containers or secure execution environments
  // This is a simplified demo using a cloud API
  
  javascript: async (code: string) => {
    try {
      // In a real implementation, you'd use a secure sandbox
      // This is just a simulation
      return await simulateExecution('javascript', code);
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  },
  
  python: async (code: string) => {
    try {
      return await simulateExecution('python', code);
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  },
  
  java: async (code: string) => {
    try {
      return await simulateExecution('java', code);
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  },
  
  cpp: async (code: string) => {
    try {
      return await simulateExecution('cpp', code);
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  },
  
  // Add handlers for other languages as needed
};

// For demo purposes, simulate code execution with sample outputs
async function simulateExecution(language: string, code: string): Promise<string> {
  // In a real implementation, this would connect to a secure execution environment
  
  // Simple validation to provide some feedback
  if (!code.trim()) {
    return 'Error: Empty code submission';
  }
  
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Provide language-specific sample outputs
  switch (language) {
    case 'javascript':
      if (code.includes('console.log')) {
        return code.match(/console\.log\(['"](.+)['"]\)/)?.[1] || 'Hello from JavaScript!';
      }
      return 'JavaScript code executed successfully.';
      
    case 'python':
      if (code.includes('print')) {
        return code.match(/print\(['"](.+)['"]\)/)?.[1] || 'Hello from Python!';
      }
      return 'Python code executed successfully.';
      
    case 'java':
      return 'Java code compiled and executed successfully.';
      
    case 'cpp':
      return 'C++ code compiled and executed successfully.';
      
    default:
      return `${language} code executed successfully.`;
  }
}

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();
    
    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }
    
    const handler = languageHandlers[language];
    
    if (!handler) {
      return NextResponse.json(
        { error: `Language '${language}' is not supported` },
        { status: 400 }
      );
    }
    
    const output = await handler(code);
    
    return NextResponse.json({ output });
  } catch (error) {
    console.error('Compilation error:', error);
    return NextResponse.json(
      { error: 'Failed to process code' },
      { status: 500 }
    );
  }
} 