import { contextBridge } from 'electron';
import titlebarContext from './titlebarContext';
import { ipcRenderer } from 'electron/renderer';

contextBridge.exposeInMainWorld('electron_window', {
  titlebar: titlebarContext,
});

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: unknown) => {
    const validChannels = ['file-contents'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: (...args: unknown[]) => void) => {
    const validChannels = ['file-contents'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
