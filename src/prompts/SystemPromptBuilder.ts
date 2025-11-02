import { ProjectMetadata } from '../interfaces/IProjectAnalyzer';

/**
 * Builds system prompts for README generation
 * Follows Single Responsibility Principle - only handles prompt construction
 */
export class SystemPromptBuilder {
  /**
   * Builds the initial system prompt for README generation
   * @param projectName Project name
   * @param description Project description
   * @param license License type
   * @param metadata Project analysis metadata
   * @returns Complete system prompt
   */
  buildInitialPrompt(
    projectName: string,
    description: string,
    license: string,
    metadata: ProjectMetadata
  ): string {
    return `You are an expert technical writer specializing in creating comprehensive, standardized README files for open-source projects. Your task is to generate a high-quality README.md file following the Standard Readme specification (https://github.com/RichardLitt/standard-readme).

## Project Information
- **Project Name**: ${projectName}
- **Description**: ${description}
- **License**: ${license}

## Project Analysis Data

${this.formatMetadata(metadata)}

## README Requirements

Generate a complete README.md file that includes the following sections in this exact order:

1. **Title** - Project name as main heading, optionally with a badge (e.g., standard-readme compliant badge)
2. **Table of Contents** - Links to all major sections
3. **Background** - Explain what the project is, why it exists, and what problem it solves
4. **Architecture** - Provide a comprehensive architecture section that includes:
   - Project structure overview
   - Module organization and purpose
   - Design patterns used
   - Key components and their relationships
   - Entry points and how they connect
   - Technology stack overview
5. **Install** - Detailed installation instructions based on the package.json and project structure
6. **Usage** - Examples of how to use the project, including code snippets if applicable
7. **Contributing** - Guidelines for contributors
8. **License** - License information (${license})
9. **Maintainers** (optional) - If applicable, list only maintainer names in a simple format, not a table. Format: "- [Maintainer Name]" or just "Maintainer Name" if only one.

## Writing Guidelines

- Use clear, concise, and professional language
- Include practical code examples where relevant
- Make the README accessible to both beginners and experienced developers
- Follow markdown best practices
- Ensure all sections are well-structured and informative
- The Architecture section should be detailed enough for developers to understand the project structure without reading the code
- Use proper markdown formatting for code blocks, lists, and emphasis
- For the Maintainers section: ONLY show maintainer names in a simple list format. Do NOT create tables with columns for GitHub, Email, etc. Format examples:
  - Single maintainer: "## Maintainers\n\n[Maintainer Name]"
  - Multiple maintainers: "## Maintainers\n\n- [Maintainer Name 1]\n- [Maintainer Name 2]"

Generate the complete README.md content now, ensuring it follows the Standard Readme specification and includes all required sections.`;
  }

  /**
   * Builds an improvement prompt for regenerating the README with user feedback
   * @param projectName Project name
   * @param description Project description
   * @param license License type
   * @param metadata Project analysis metadata
   * @param currentReadme The current README content
   * @param improvementFeedback User's feedback on what to improve
   * @returns Complete system prompt for improvement
   */
  buildImprovementPrompt(
    projectName: string,
    description: string,
    license: string,
    metadata: ProjectMetadata,
    currentReadme: string,
    improvementFeedback: string
  ): string {
    return `You are an expert technical writer specializing in improving README files. You need to regenerate the README.md file with specific improvements requested by the user.

## Project Information
- **Project Name**: ${projectName}
- **Description**: ${description}
- **License**: ${license}

## Project Analysis Data

${this.formatMetadata(metadata)}

## Current README

\`\`\`markdown
${currentReadme}
\`\`\`

## User's Improvement Request

${improvementFeedback}

## Task

Please regenerate the complete README.md file that:
1. Incorporates the user's requested improvements
2. Maintains all existing good content from the current README
3. Follows the Standard Readme specification (https://github.com/RichardLitt/standard-readme)
4. Includes all required sections: Title, Table of Contents, Background, Architecture, Install, Usage, Contributing, License
5. Uses clear, professional markdown formatting
6. For Maintainers section: Only show maintainer names in a simple list format, NOT a table with GitHub/Email columns

Generate the improved, complete README.md content now.`;
  }

  /**
   * Formats project metadata into a readable string for the prompt
   */
  private formatMetadata(metadata: ProjectMetadata): string {
    let formatted = '';

    // Package information
    if (metadata.package) {
      formatted += '### Package Information\n';
      if (metadata.package.name) formatted += `- Name: ${metadata.package.name}\n`;
      if (metadata.package.version) formatted += `- Version: ${metadata.package.version}\n`;
      if (metadata.package.description) formatted += `- Description: ${metadata.package.description}\n`;
      if (metadata.package.main) formatted += `- Main entry: ${metadata.package.main}\n`;
      if (metadata.package.scripts && Object.keys(metadata.package.scripts).length > 0) {
        formatted += `- Scripts: ${Object.keys(metadata.package.scripts).join(', ')}\n`;
      }
      if (metadata.package.dependencies && Object.keys(metadata.package.dependencies).length > 0) {
        formatted += `- Dependencies: ${Object.keys(metadata.package.dependencies).slice(0, 10).join(', ')}\n`;
      }
      formatted += '\n';
    }

    // Structure information
    formatted += '### Project Structure\n';
    if (metadata.structure.directories.length > 0) {
      formatted += `- Main directories: ${metadata.structure.directories.slice(0, 15).join(', ')}\n`;
    }
    if (metadata.structure.mainFiles.length > 0) {
      formatted += `- Entry files: ${metadata.structure.mainFiles.slice(0, 10).join(', ')}\n`;
    }
    formatted += '\n';

    // Codebase information
    formatted += '### Codebase Analysis\n';
    if (metadata.codebase.languages.length > 0) {
      formatted += `- Languages: ${metadata.codebase.languages.join(', ')}\n`;
    }
    if (metadata.codebase.frameworks.length > 0) {
      formatted += `- Frameworks: ${metadata.codebase.frameworks.join(', ')}\n`;
    }
    if (metadata.codebase.patterns.length > 0) {
      formatted += `- Patterns: ${metadata.codebase.patterns.join(', ')}\n`;
    }
    if (metadata.codebase.apiSignatures.length > 0) {
      formatted += `- API signatures (sample): ${metadata.codebase.apiSignatures.slice(0, 5).join('; ')}\n`;
    }
    formatted += '\n';

    // Architecture information
    formatted += '### Architecture Analysis\n';
    if (metadata.architecture.modules.length > 0) {
      formatted += `- Modules: ${metadata.architecture.modules.slice(0, 15).join(', ')}\n`;
    }
    if (metadata.architecture.designPatterns.length > 0) {
      formatted += `- Design patterns: ${metadata.architecture.designPatterns.join(', ')}\n`;
    }
    if (metadata.architecture.entryPoints.length > 0) {
      formatted += `- Entry points: ${metadata.architecture.entryPoints.slice(0, 5).join(', ')}\n`;
    }
    if (metadata.architecture.components.length > 0) {
      formatted += `- Key components: ${metadata.architecture.components.slice(0, 10).map(c => c.name).join(', ')}\n`;
    }
    formatted += '\n';

    return formatted;
  }
}

