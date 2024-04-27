import '@styles/app.css';

import React, { useEffect, useRef, useState } from 'react';

// import '@styles/app.scss';
import { SquigglePlayground } from '@quri/squiggle-components';
import { SqLinker } from '@quri/squiggle-lang';
import { Button } from '@quri/ui';

export function parseSourceId(sourceId: string): string {
  const regex = /file:(.+)/;
  const match = sourceId.match(regex);

  if (!match) {
    throw new Error('Invalid import name');
  }

  const path = match[0].replace('file:', '');

  return path;
}

const Application: React.FC = () => {
  const [darkTheme, setDarkTheme] = useState(true);
  const [code, setCode] = useState('foo = normal(10,1)');
  const [currentPath, setCurrentPath] = useState('');
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleData = (height: number) => {
      setContainerHeight(height - 28);
    };
    window.api.receive('window-height', (height) => {
      handleData(height);
    });

    return () => {
      window.api.removeListener('window-height', handleData);
    };
  }, []);

  useEffect(() => {
    // Function to handle the received data
    const handleData = async (data: { path: string; contents: string }) => {
      localStorage.setItem('currentPath', data.path);
      localStorage.setItem('fileContents', data.contents);
      setCode(data.contents);
      setCurrentPath(data.path);
    };

    // Subscribe to the "fromMain" channel
    window.api.receive('file-contents', handleData);

    // Cleanup on component unmount
    return () => {
      // Assuming you have a method to remove the listener
      window.api.removeListener('file-contents', handleData); // You might need to implement removeListener method in your preload script
    };
  }, []);

  const saveFile = () => {
    // Assuming `code` is the state variable holding the content you want to save
    window.api
      .saveFile(currentPath, code)
      .then(() => {
        // File was saved successfully
        console.log(`File saved`);
      })
      .catch((error: any) => {
        console.error('Failed to save file:', error);
      });
  };

  useEffect(() => {
    // Function to handle the save file action
    const handleSaveFile = () => {
      saveFile();
    };

    // Subscribe to the "save-file" channel
    window.api.receive('save-file', handleSaveFile);

    // Cleanup on component unmount
    return () => {
      // Assuming you have a method to remove the listener
      window.api.removeListener('save-file', handleSaveFile); // Adjust based on your actual API
    };
  }, []);

  const squiggleLinker: SqLinker = {
    resolve(name: string) {
      return name;
    },
    async loadSource(sourceId: string) {
      const relativePath = parseSourceId(sourceId);
      const modelCode = await window.api.getFile(currentPath, relativePath);
      if (!modelCode) {
        throw new Error('File not found');
      }

      return modelCode;
    },
  };
  return (
    <div
      id='erwt'
      ref={containerRef}
      className='bg-white'
      style={{ height: containerHeight }}
    >
      <SquigglePlayground
        defaultCode={code}
        linker={squiggleLinker}
        height={containerHeight}
        key={currentPath}
        onCodeChange={(code) => {
          setCode(code);
          localStorage.setItem('fileContents', code);
        }}
        renderExtraControls={() => (
          <div className='flex h-full items-center'>
            <Button onClick={saveFile} theme={'primary'} size='small'>
              Save
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default Application;
