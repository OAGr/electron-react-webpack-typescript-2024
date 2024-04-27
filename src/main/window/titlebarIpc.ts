/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Titlebar IPC (Main Process)
 */

import { openAndReadFile } from '@main/common/utils';
import { BrowserWindow, ipcMain, shell, dialog } from 'electron';
import fs from 'fs';

export const registerTitlebarIpc = (mainWindow: BrowserWindow) => {
  ipcMain.handle('window-minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.handle('window-maximize', () => {
    mainWindow.maximize();
  });

  ipcMain.handle('window-toggle-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle('window-close', () => {
    mainWindow.close();
  });

  ipcMain.handle('web-undo', () => {
    mainWindow.webContents.undo();
  });

  ipcMain.handle('web-redo', () => {
    mainWindow.webContents.redo();
  });

  ipcMain.handle('web-cut', () => {
    mainWindow.webContents.cut();
  });

  ipcMain.handle('web-copy', () => {
    mainWindow.webContents.copy();
  });

  ipcMain.handle('web-paste', () => {
    mainWindow.webContents.paste();
  });

  ipcMain.handle('web-delete', () => {
    mainWindow.webContents.delete();
  });

  ipcMain.handle('web-select-all', () => {
    mainWindow.webContents.selectAll();
  });

  ipcMain.handle('web-reload', () => {
    mainWindow.webContents.reload();
  });

  ipcMain.handle('web-force-reload', () => {
    mainWindow.webContents.reloadIgnoringCache();
  });

  ipcMain.handle('web-toggle-devtools', () => {
    mainWindow.webContents.toggleDevTools();
  });

  ipcMain.handle('web-actual-size', () => {
    mainWindow.webContents.setZoomLevel(0);
  });

  ipcMain.handle('web-zoom-in', () => {
    mainWindow.webContents.setZoomLevel(mainWindow.webContents.zoomLevel + 0.5);
  });

  ipcMain.handle('web-zoom-out', () => {
    mainWindow.webContents.setZoomLevel(mainWindow.webContents.zoomLevel - 0.5);
  });

  ipcMain.handle('web-toggle-fullscreen', () => {
    mainWindow.setFullScreen(!mainWindow.fullScreen);
  });

  ipcMain.handle('open-url', (e, url) => {
    shell.openExternal(url);
  });

  ipcMain.handle('get-file', async (event, { fileName }) => {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', (err, fileContents) => {
        if (err) {
          reject(err);
        } else {
          resolve(fileContents);
        }
      });
    });
  });

  ipcMain.handle(
    'save-file',
    async (
      event,
      { fileName, content }: { fileName: string; content: string },
    ) => {
      if (fileName === '') {
        const { canceled, filePath } = await dialog.showSaveDialog({
          title: 'Save your squiggle file',
          defaultPath: 'myCode.squiggle',
          filters: [{ name: 'Squiggle Files', extensions: ['squiggle'] }],
        });
        fileName = filePath;
      }
      console.log('Saving', fileName, content);

      fs.writeFile(fileName, content, (err) => {
        if (err) {
          console.error(err);
        }
      });
    },
  );

  ipcMain.handle('open-file-explorer', () => {
    openAndReadFile(mainWindow);
  });
};
