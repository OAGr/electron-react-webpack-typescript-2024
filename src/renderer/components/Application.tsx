import '@styles/app.css';

import React, { useEffect, useState } from 'react';

const { ipcRenderer } = window.Electron;

import { SquigglePlayground } from '@quri/squiggle-components';

declare global {
  interface Window {
    ipcRenderer: {
      on: (channel: string, func: (...args: any[]) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

const Application: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const [darkTheme, setDarkTheme] = useState(true);
  const [versions, setVersions] = useState<Record<string, string>>({});
  const [filePath, setFilePath] = useState('');
  const [fileContents, setFileContents] = useState('');

  /**
   * On component mount
   */
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

  // useEffect(() => {
  //   const handleFileContents = (
  //     event: Electron.IpcRendererEvent,
  //     data: { path: string; contents: string },
  //   ) => {
  //     console.log('File path:', data.path);
  //     console.log('File contents:', data.contents);
  //     setFilePath(data.path); // Update state with the file path
  //     setFileContents(data.contents); // Update state with the file contents
  //   };

  //   ipcRenderer.on('file-contents', handleFileContents);

  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     ipcRenderer.removeListener('file-contents', handleFileContents);
  //   };
  // }, []);

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

  /**
   * Toggle Theme
   */
  function toggleTheme() {
    setDarkTheme(!darkTheme);
  }

  console.log('WINDOW', window);
  return (
    <div id='erwt' className=''>
      <div className='header'></div>
      {fileContents}
      {filePath}
      <div className='bg-white'>
        <SquigglePlayground defaultCode='foo = normal(5,2)' height={700} />
      </div>

      <div className='footer'>
        <div className='center'>
          <button
            onClick={() => {
              if (counter > 99) return alert('Going too high!!');
              setCounter(counter + 1);
            }}
          >
            Increment {counter != 0 ? counter : ''} <span>{counter}</span>
          </button>
          &nbsp;&nbsp; &nbsp;&nbsp;
          <button
            onClick={() => {
              if (counter == 0) return alert('Oops.. thats not possible!');
              setCounter(counter > 0 ? counter - 1 : 0);
            }}
          >
            Decrement <span>{counter}</span>
          </button>
          &nbsp;&nbsp; &nbsp;&nbsp;
          <button onClick={toggleTheme}>
            {darkTheme ? 'Light Theme' : 'Dark Theme'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Application;
