/**
 * Interface for API client implementations
 * Follows Interface Segregation Principle - clients only depend on what they need
 */
export interface IApiClient {
  /**
   * Sends a chat completion request to the API
   * @param messages Array of messages in the conversation
   * @param model The model to use (default: gpt-oss-120b)
   * @returns Promise resolving to the generated text
   */
  generateText(messages: Array<{ role: string; content: string }>, model?: string): Promise<string>;
}

