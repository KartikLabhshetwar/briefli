import { Validator } from './Validator';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Configuration management utility
 * Follows Single Responsibility Principle - only handles configuration
 * Stores API keys in system config directory (like CLI tools do)
 */
export class Config {
  private static configDir: string;
  private static configFile: string;

  /**
   * Gets the config directory path (cross-platform)
   * ~/.config/briefli on Linux/Mac
   * %APPDATA%\briefli on Windows
   */
  static getConfigDir(): string {
    if (this.configDir) {
      return this.configDir;
    }

    const homeDir = os.homedir();
    const platform = process.platform;

    if (platform === 'win32') {
      // Windows: %APPDATA%\briefli
      this.configDir = path.join(homeDir, 'AppData', 'Roaming', 'briefli');
    } else {
      // Linux/Mac: ~/.config/briefli
      this.configDir = path.join(homeDir, '.config', 'briefli');
    }

    return this.configDir;
  }

  /**
   * Gets the config file path
   */
  static getConfigFilePath(): string {
    if (this.configFile) {
      return this.configFile;
    }

    this.configFile = path.join(this.getConfigDir(), 'config.json');
    return this.configFile;
  }

  /**
   * Loads API key from system config file
   * @returns The API key from config file or undefined
   */
  static getApiKey(): string | undefined {
    const configPath = this.getConfigFilePath();

    try {
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configContent);

        if (config.apiKey && typeof config.apiKey === 'string') {
          try {
            Validator.validateApiKey(config.apiKey);
            return config.apiKey;
          } catch {
            // Invalid key, return undefined
            return undefined;
          }
        }
      }
    } catch (error) {
      // Silently fail if config file is corrupted or doesn't exist
      return undefined;
    }

    return undefined;
  }

  /**
   * Saves API key to system config file
   * @param apiKey The API key to save
   * @returns Promise that resolves when saved
   */
  static async saveApiKey(apiKey: string): Promise<void> {
    const configDir = this.getConfigDir();
    const configPath = this.getConfigFilePath();

    try {
      // Validate API key before saving
      Validator.validateApiKey(apiKey);

      // Ensure config directory exists
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true, mode: 0o700 }); // Secure directory permissions
      }

      // Read existing config if it exists
      let config: any = {};
      if (fs.existsSync(configPath)) {
        try {
          const existingContent = fs.readFileSync(configPath, 'utf-8');
          config = JSON.parse(existingContent);
        } catch {
          // If corrupted, start fresh
          config = {};
        }
      }

      // Update API key
      config.apiKey = apiKey.trim();
      config.lastUpdated = new Date().toISOString();

      // Write config file with secure permissions (read/write for owner only)
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), {
        encoding: 'utf-8',
        mode: 0o600, // rw------- (owner read/write only)
      });
    } catch (error) {
      throw new Error(
        `Failed to save API key to config file: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Gets the project root path (defaults to current working directory)
   * @returns The project root path
   */
  static getProjectRoot(): string {
    return process.cwd();
  }
}

