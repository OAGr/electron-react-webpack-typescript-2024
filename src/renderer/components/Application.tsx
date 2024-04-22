import '@styles/app.css';

import React, { useEffect, useRef, useState } from 'react';

// import '@styles/app.scss';
import { SquigglePlayground } from '@quri/squiggle-components';
import { Button } from '@quri/ui';

const Application: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const [darkTheme, setDarkTheme] = useState(true);
  const [versions, setVersions] = useState<Record<string, string>>({});
  const [code, setCode] = useState('foo = normal(10,1)');
  const [path, setCurrentPath] = useState('');
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const useDarkTheme = parseInt(localStorage.getItem('dark-mode'));
    if (isNaN(useDarkTheme)) {
      setDarkTheme(true);
    } else if (useDarkTheme == 1) {
      setDarkTheme(true);
    } else if (useDarkTheme == 0) {
      setDarkTheme(false);
    }

    // Apply verisons
    const app = document.getElementById('app');
    const versions = JSON.parse(app.getAttribute('data-versions'));
    setVersions(versions);
  }, []);

  /**
   * On Dark theme change
   */
  useEffect(() => {
    if (darkTheme) {
      localStorage.setItem('dark-mode', '1');
      document.body.classList.add('dark-mode');
    } else {
      localStorage.setItem('dark-mode', '0');
      document.body.classList.remove('dark-mode');
    }
  }, [darkTheme]);

  useEffect(() => {
    // Function to handle the received data
    const handleData = (data: { path: string; contents: string }) => {
      localStorage.setItem('path', data.path);
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
      .saveFile(path, code)
      .then(() => {
        // File was saved successfully
        console.log(`File saved to`);
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
  /**
   * Toggle Theme
   */
  function toggleTheme() {
    setDarkTheme(!darkTheme);
  }

  return (
    <div
      id='erwt'
      ref={containerRef}
      className='bg-white'
      style={{ height: containerHeight }}
    >
      <SquigglePlayground
        defaultCode={code}
        height={containerHeight}
        key={path}
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
