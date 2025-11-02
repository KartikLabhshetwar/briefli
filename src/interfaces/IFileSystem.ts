/**
 * Interface for file system operations
 * Follows Interface Segregation Principle - separates file operations
 */
export interface IFileSystem {
  /**
   * Reads a file and returns its contents
   * @param filePath Path to the file
   * @returns Promise resolving to the file contents
   */
  readFile(filePath: string): Promise<string>;

  /**
   * Writes content to a file
   * @param filePath Path to the file
   * @param content Content to write
   * @returns Promise that resolves when the file is written
   */
  writeFile(filePath: string, content: string): Promise<void>;

  /**
   * Checks if a file exists
   * @param filePath Path to the file
   * @returns Promise resolving to true if file exists, false otherwise
   */
  fileExists(filePath: string): Promise<boolean>;

  /**
   * Reads a directory and returns its contents
   * @param dirPath Path to the directory
   * @returns Promise resolving to array of file/directory names
   */
  readDirectory(dirPath: string): Promise<string[]>;
}

