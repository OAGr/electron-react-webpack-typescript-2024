import { contextBridge, ipcRenderer } from 'electron';
import titlebarContext from './titlebarContext';

contextBridge.exposeInMainWorld('Electron', {
  titlebar: titlebarContext,
  ipcRenderer: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    removeAllListeners: (channel: string) =>
      ipcRenderer.removeAllListeners(channel),
  },
});
