/**
 * Interface for project analysis
 * Follows Interface Segregation Principle - separates analysis concerns
 */
export interface ProjectMetadata {
  package?: {
    name?: string;
    version?: string;
    description?: string;
    main?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  structure: {
    directories: string[];
    files: string[];
    mainFiles: string[];
  };
  codebase: {
    languages: string[];
    frameworks: string[];
    patterns: string[];
    apiSignatures: string[];
  };
  architecture: {
    modules: string[];
    designPatterns: string[];
    entryPoints: string[];
    components: Array<{ name: string; type: string; path: string }>;
    relationships: Array<{ from: string; to: string; type: string }>;
  };
}

/**
 * Interface for project analyzer implementations
 */
export interface IProjectAnalyzer {
  /**
   * Analyzes the project and returns structured metadata
   * @param projectPath Path to the project root (default: current directory)
   * @returns Promise resolving to project metadata
   */
  analyze(projectPath?: string): Promise<ProjectMetadata>;
}

