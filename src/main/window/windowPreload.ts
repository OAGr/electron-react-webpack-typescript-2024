import { contextBridge } from 'electron';
import titlebarContext from './titlebarContext';
import { ipcRenderer } from 'electron/renderer';

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
  getLocalStorageItem: (key: string) => {
    return ipcRenderer.invoke('get-local-storage-item', key);
  },
});
