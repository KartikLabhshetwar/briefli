import { IFileSystem } from '../interfaces/IFileSystem';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Concrete implementation of IFileSystem using Node.js fs module
 * Follows Dependency Inversion Principle - depends on interface
 */
export class FileSystem implements IFileSystem {
  /**
   * Reads a file and returns its contents
   * @param filePath Path to the file
   * @returns Promise resolving to the file contents
   */
  async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Writes content to a file
   * @param filePath Path to the file
   * @param content Content to write
   * @returns Promise that resolves when the file is written
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Checks if a file exists
   * @param filePath Path to the file
   * @returns Promise resolving to true if file exists, false otherwise
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Reads a directory and returns its contents
   * @param dirPath Path to the directory
   * @returns Promise resolving to array of file/directory names
   */
  async readDirectory(dirPath: string): Promise<string[]> {
    try {
      return await fs.readdir(dirPath);
    } catch (error) {
      throw new Error(`Failed to read directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

