import { contextBridge } from 'electron';
import titlebarContext from './titlebarContext';
import { ipcRenderer } from 'electron/renderer';
import path from 'path';

contextBridge.exposeInMainWorld('electron_window', {
  titlebar: titlebarContext,
});

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: unknown) => {
    const validChannels = ['file-contents', 'save-file', 'open-file-explorer'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: (...args: unknown[]) => void) => {
    const validChannels = [
      'file-contents',
      'save-file',
      'window-height',
      'open-file-explorer',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  saveFile: (fileName: string, content: string) => {
    console.log('Save file', fileName, content);
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('save-file', { fileName, content });
      resolve('true');
    });
  },
  getFile: async (rootPath: string, relativePath: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const directoryPath = path.dirname(rootPath);
        const fullPath = path.join(directoryPath, relativePath);
        console.log('Getting file', fullPath, 'from', {
          rootPath,
          relativePath,
        });
        const fileContents = await ipcRenderer.invoke('get-file', {
          fileName: fullPath,
        });
        resolve(fileContents);
      } catch (error) {
        reject(error);
      }
    });
  },
  getLocalStorageItem: (key: string) => {
    return ipcRenderer.invoke('get-local-storage-item', key);
  },
});
