import { IApiClient } from '../interfaces/IApiClient';
import Groq from 'groq-sdk';

/**
 * Groq API client implementation
 * Follows Dependency Inversion Principle - implements IApiClient interface
 * Uses Groq SDK to communicate with gpt-oss-120b model
 */
export class GroqClient implements IApiClient {
  private client: Groq;
  private defaultModel: string = 'openai/gpt-oss-120b';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Groq API key is required');
    }
    this.client = new Groq({
      apiKey: apiKey,
    });
  }

  /**
   * Sends a chat completion request to the Groq API
   * @param messages Array of messages in the conversation
   * @param model The model to use (default: gpt-oss-120b)
   * @returns Promise resolving to the generated text
   */
  async generateText(
    messages: Array<{ role: string; content: string }>,
    model: string = this.defaultModel
  ): Promise<string> {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages: messages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
        })),
        model: model,
        temperature: 0.7,
        max_tokens: 4000,
      });

      const content = chatCompletion.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content returned from Groq API');
      }

      return content;
    } catch (error) {
      if (error instanceof Error) {
        // Provide more helpful error messages
        if (error.message.includes('401') || error.message.includes('authentication')) {
          throw new Error('Invalid Groq API key. Please check your GROQ_API_KEY environment variable.');
        }
        if (error.message.includes('429') || error.message.includes('rate limit')) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`Groq API error: ${error.message}`);
      }
      throw new Error(`Unknown error occurred while calling Groq API: ${String(error)}`);
    }
  }
}

