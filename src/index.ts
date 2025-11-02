/**
 * Main package exports
 */
export { CLI } from './cli/index';
export { ProjectAnalyzer } from './analyzer/ProjectAnalyzer';
export { ReadmeGenerator } from './generator/ReadmeGenerator';
export { GroqClient } from './generator/GroqClient';
export { SystemPromptBuilder } from './prompts/SystemPromptBuilder';
export { BashExecutor } from './utils/BashExecutor';
export { FileSystem } from './utils/FileSystem';
export { Validator } from './utils/Validator';
export { Config } from './utils/Config';

// Re-export interfaces
export type { IApiClient } from './interfaces/IApiClient';
export type { IBashExecutor } from './interfaces/IBashExecutor';
export type { IFileSystem } from './interfaces/IFileSystem';
export type { IProjectAnalyzer, ProjectMetadata } from './interfaces/IProjectAnalyzer';

