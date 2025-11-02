/**
 * Interface for bash script execution
 * Follows Interface Segregation Principle - separates execution concerns
 */
export interface IBashExecutor {
  /**
   * Executes a bash script and returns the output
   * @param scriptPath Path to the bash script
   * @param args Optional arguments to pass to the script
   * @returns Promise resolving to the script output
   */
  execute(scriptPath: string, args?: string[]): Promise<string>;

  /**
   * Executes a bash command directly
   * @param command The bash command to execute
   * @returns Promise resolving to the command output
   */
  executeCommand(command: string): Promise<string>;
}

