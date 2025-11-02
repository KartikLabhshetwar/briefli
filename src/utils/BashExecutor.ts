import { IBashExecutor } from '../interfaces/IBashExecutor';
import * as shell from 'shelljs';

/**
 * Concrete implementation of IBashExecutor using shelljs
 * Follows Dependency Inversion Principle - depends on interface
 */
export class BashExecutor implements IBashExecutor {
  /**
   * Executes a bash script and returns the output
   * @param scriptPath Path to the bash script
   * @param args Optional arguments to pass to the script
   * @returns Promise resolving to the script output
   */
  async execute(scriptPath: string, args: string[] = []): Promise<string> {
    try {
      const command = args.length > 0 
        ? `bash ${scriptPath} ${args.join(' ')}`
        : `bash ${scriptPath}`;
      
      const result = shell.exec(command, { silent: true });
      
      if (result.code !== 0) {
        throw new Error(`Script execution failed: ${result.stderr || 'Unknown error'}`);
      }
      
      return result.stdout.trim();
    } catch (error) {
      throw new Error(`Failed to execute script ${scriptPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Executes a bash command directly
   * @param command The bash command to execute
   * @returns Promise resolving to the command output
   */
  async executeCommand(command: string): Promise<string> {
    try {
      const result = shell.exec(command, { silent: true });
      
      if (result.code !== 0) {
        throw new Error(`Command execution failed: ${result.stderr || 'Unknown error'}`);
      }
      
      return result.stdout.trim();
    } catch (error) {
      throw new Error(`Failed to execute command: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

