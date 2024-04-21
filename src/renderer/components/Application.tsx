import '@styles/app.css';

import React, { useEffect, useState } from 'react';

// import '@styles/app.scss';
import { SquigglePlayground } from '@quri/squiggle-components';
import { ipcRenderer } from 'electron';

const Application: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const [darkTheme, setDarkTheme] = useState(true);
  const [versions, setVersions] = useState<Record<string, string>>({});
  const [code, setCode] = useState('foo = normal(10,1)');
  const [path, setCurrentPath] = useState('');

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

  /**
   * Toggle Theme
   */
  function toggleTheme() {
    setDarkTheme(!darkTheme);
  }

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

  return (
    <div id='erwt' className=''>
      <div className='header'>
        <div className='bg-white'>
          <SquigglePlayground
            defaultCode={code}
            height={700}
            key={path}
            onCodeChange={(code) => {
              setCode(code);
              localStorage.setItem('fileContents', code);
            }}
            renderExtraControls={() => <div onClick={saveFile}>save!</div>}
          />
        </div>
      </div>

      <div className='footer'>
        <div className='center'>
          <button
            onClick={() => {
              saveFile();
              // ipcRenderer.send('save-file', 'foo.md', 'my doc');
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
