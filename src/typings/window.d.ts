interface Window {
  api: {
    receive(channel: string, func: (...args: any[]) => void): void;
    // Define other methods of `api` as needed
    removeListener(channel: string, func: (...args: any[]) => void): void;
    saveFile(fileName: string, content: string): promise<void>;
    getFile(currentPath: string, relativePath: string): promise<string>;
    on(channel: string, func: (...args: any[]) => void): void;
  };
}
