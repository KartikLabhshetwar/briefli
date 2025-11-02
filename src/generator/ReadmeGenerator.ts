import { IApiClient } from '../interfaces/IApiClient';
import { SystemPromptBuilder } from '../prompts/SystemPromptBuilder';
import { ProjectMetadata } from '../interfaces/IProjectAnalyzer';

/**
 * README generator that coordinates prompt building and API calls
 * Follows Single Responsibility Principle - only handles README generation
 * Uses Dependency Inversion - depends on IApiClient interface
 */
export class ReadmeGenerator {
  private apiClient: IApiClient;
  private promptBuilder: SystemPromptBuilder;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
    this.promptBuilder = new SystemPromptBuilder();
  }

  /**
   * Generates an initial README based on project information
   * @param projectName Project name
   * @param description Project description
   * @param license License type
   * @param metadata Project analysis metadata
   * @returns Generated README content
   */
  async generateInitial(
    projectName: string,
    description: string,
    license: string,
    metadata: ProjectMetadata
  ): Promise<string> {
    try {
      const systemPrompt = this.promptBuilder.buildInitialPrompt(
        projectName,
        description,
        license,
        metadata
      );

      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: 'Please generate the complete README.md file following the Standard Readme specification.',
        },
      ];

      const generatedContent = await this.apiClient.generateText(messages);

      // Extract README content (in case API returns it wrapped in markdown code blocks)
      return this.extractReadmeContent(generatedContent);
    } catch (error) {
      throw new Error(
        `Failed to generate README: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Improves an existing README based on user feedback
   * @param projectName Project name
   * @param description Project description
   * @param license License type
   * @param metadata Project analysis metadata
   * @param currentReadme Current README content
   * @param improvementFeedback User's feedback on what to improve
   * @returns Improved README content
   */
  async improve(
    projectName: string,
    description: string,
    license: string,
    metadata: ProjectMetadata,
    currentReadme: string,
    improvementFeedback: string
  ): Promise<string> {
    try {
      const systemPrompt = this.promptBuilder.buildImprovementPrompt(
        projectName,
        description,
        license,
        metadata,
        currentReadme,
        improvementFeedback
      );

      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Please regenerate the README.md file incorporating the following improvements: ${improvementFeedback}`,
        },
      ];

      const generatedContent = await this.apiClient.generateText(messages);

      // Extract README content (in case API returns it wrapped in markdown code blocks)
      return this.extractReadmeContent(generatedContent);
    } catch (error) {
      throw new Error(
        `Failed to improve README: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Extracts README content from API response
   * Handles cases where API wraps content in markdown code blocks
   */
  private extractReadmeContent(content: string): string {
    // Remove markdown code block wrappers if present
    const codeBlockRegex = /^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/;
    const match = content.match(codeBlockRegex);
    
    if (match && match[1]) {
      return match[1].trim();
    }

    // If no code block, return as-is (trimmed)
    return content.trim();
  }
}

