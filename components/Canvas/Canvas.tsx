'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text } from 'react-konva';
import { getSocket } from '@/lib/socket';
import { CanvasObject } from '@/types';

export default function Canvas() {
  const [tool, setTool] = useState<'select' | 'rect' | 'circle' | 'text' | 'pen'>('select');
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const stageRef = useRef<any>(null);
  const layerRef = useRef<any>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on('canvas_update', (canvasObjects: CanvasObject[]) => {
      setObjects(canvasObjects);
    });

    socket.on('canvas_object_added', (object: CanvasObject) => {
      setObjects(prev => [...prev, object]);
    });

    socket.on('canvas_object_updated', (updatedObject: CanvasObject) => {
      setObjects(prev => prev.map(obj => obj.id === updatedObject.id ? updatedObject : obj));
    });

    socket.on('canvas_object_removed', (objectId: string) => {
      setObjects(prev => prev.filter(obj => obj.id !== objectId));
    });

    return () => {
      socket.off('canvas_update');
      socket.off('canvas_object_added');
      socket.off('canvas_object_updated');
      socket.off('canvas_object_removed');
    };
  }, []);

  const handleMouseDown = (e: any) => {
    if (tool === 'select') return;

    const pos = e.target.getStage().getPointerPosition();
    
    if (tool === 'pen') {
      setIsDrawing(true);
      setCurrentPath([pos.x, pos.y]);
    } else {
      // Create a new object based on the selected tool
      const newObject: CanvasObject = {
        id: Date.now().toString(),
        type: tool === 'rect' ? 'rect' : tool === 'circle' ? 'circle' : 'text',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        radius: 0,
        text: tool === 'text' ? 'Double click to edit' : '',
        userId: getSocket().id || 'anonymous',
        fill: '#ffffff',
        stroke: '#000000',
      };
      
      if (tool === 'rect') {
        newObject.width = 100;
        newObject.height = 50;
      } else if (tool === 'circle') {
        newObject.radius = 30;
      }
      
      // Add the object to our canvas and send to others
      setObjects(prev => [...prev, newObject]);
      getSocket().emit('canvas_object_added', newObject);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || tool !== 'pen') return;
    
    const pos = e.target.getStage().getPointerPosition();
    setCurrentPath(prev => [...prev, pos.x, pos.y]);
  };

  const handleMouseUp = () => {
    if (tool === 'pen' && isDrawing) {
      const newPath: CanvasObject = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'path',
        x: 0,
        y: 0,
        points: currentPath,
        userId: getSocket().id || 'anonymous',
        stroke: '#000000',
        strokeWidth: 2,
      };
      
      setObjects(prev => [...prev, newPath]);
      getSocket().emit('canvas_object_added', newPath);
      setIsDrawing(false);
      setCurrentPath([]);
    }
  };

  return (
    <div className="flex flex-col h-full canvas-container">
      <div className="flex items-center p-2 space-x-2 bg-white border-b">
        <div className="flex space-x-1">
          <button
            onClick={() => setTool('select')}
            className={`p-2 text-sm rounded ${tool === 'select' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            title="Select"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => setTool('rect')}
            className={`p-2 text-sm rounded ${tool === 'rect' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            title="Rectangle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm0 2h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-2 text-sm rounded ${tool === 'circle' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            title="Circle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => setTool('text')}
            className={`p-2 text-sm rounded ${tool === 'text' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            title="Text"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4a1 1 0 01-1-1V5a1 1 0 011-1h12a1 1 0 011 1v10a1 1 0 01-1 1z" clipRule="evenodd" />
              <path d="M10 7a1 1 0 00-1 1v1H7a1 1 0 100 2h2v1a1 1 0 102 0v-1h2a1 1 0 100-2h-2V8a1 1 0 00-1-1z" />
            </svg>
          </button>
          <button
            onClick={() => setTool('pen')}
            className={`p-2 text-sm rounded ${tool === 'pen' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            title="Pen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-gray-50">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 100}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
        >
          <Layer ref={layerRef}>
            {objects.map((obj) => {
              if (obj.type === 'rect') {
                return (
                  <Rect
                    key={obj.id}
                    x={obj.x}
                    y={obj.y}
                    width={obj.width}
                    height={obj.height}
                    fill={obj.fill}
                    stroke={obj.stroke}
                    draggable={tool === 'select'}
                    onDragEnd={(e) => {
                      const updatedObj = { ...obj, x: e.target.x(), y: e.target.y() };
                      setObjects(prev => prev.map(o => o.id === obj.id ? updatedObj : o));
                      getSocket().emit('canvas_object_updated', updatedObj);
                    }}
                  />
                );
              } else if (obj.type === 'circle') {
                return (
                  <Circle
                    key={obj.id}
                    x={obj.x}
                    y={obj.y}
                    radius={obj.radius}
                    fill={obj.fill}
                    stroke={obj.stroke}
                    draggable={tool === 'select'}
                    onDragEnd={(e) => {
                      const updatedObj = { ...obj, x: e.target.x(), y: e.target.y() };
                      setObjects(prev => prev.map(o => o.id === obj.id ? updatedObj : o));
                      getSocket().emit('canvas_object_updated', updatedObj);
                    }}
                  />
                );
              } else if (obj.type === 'text') {
                return (
                  <Text
                    key={obj.id}
                    x={obj.x}
                    y={obj.y}
                    text={obj.text}
                    fontSize={16}
                    fill="#000000"
                    draggable={tool === 'select'}
                    onDragEnd={(e) => {
                      const updatedObj = { ...obj, x: e.target.x(), y: e.target.y() };
                      setObjects(prev => prev.map(o => o.id === obj.id ? updatedObj : o));
                      getSocket().emit('canvas_object_updated', updatedObj);
                    }}
                    onDblClick={(e) => {
                      // Only allow editing if select tool is active
                      if (tool !== 'select') return;
                      
                      const textBox = prompt('Edit text:', obj.text);
                      if (textBox !== null) {
                        const updatedObj = { ...obj, text: textBox };
                        setObjects(prev => prev.map(o => o.id === obj.id ? updatedObj : o));
                        getSocket().emit('canvas_object_updated', updatedObj);
                      }
                    }}
                  />
                );
              } else if (obj.type === 'path') {
                return (
                  <Line
                    key={obj.id}
                    points={obj.points}
                    stroke={obj.stroke}
                    strokeWidth={obj.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              }
              return null;
            })}
            {isDrawing && (
              <Line
                points={currentPath}
                stroke="#000000"
                strokeWidth={2}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
} 