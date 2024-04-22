import { BrowserWindow, dialog } from 'electron';
const fs = require('fs');

/**
 * Opens a file dialog, reads the selected file, and sends its contents to the renderer process.
 * @param win The BrowserWindow instance to send the file contents to.
 */
export function openAndReadFile(win: BrowserWindow): void {
  dialog
    .showOpenDialog(win, {
      properties: ['openFile'],
      filters: [{ name: 'Squiggle Files', extensions: ['squiggle'] }],
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        fs.readFile(
          filePath,
          'utf8',
          (err: NodeJS.ErrnoException | null, data: string) => {
            if (err) {
              console.error(err);
              return;
            }
            // Send the file content back to the renderer process
            win.webContents.send('file-contents', {
              path: filePath,
              contents: data,
            });
          },
        );
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
