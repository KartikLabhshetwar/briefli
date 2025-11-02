import { IProjectAnalyzer, ProjectMetadata } from '../interfaces/IProjectAnalyzer';
import { IBashExecutor } from '../interfaces/IBashExecutor';
import * as path from 'path';

/**
 * Project analyzer implementation
 * Follows Single Responsibility Principle - only handles project analysis
 * Uses Dependency Inversion - depends on IBashExecutor interface
 */
export class ProjectAnalyzer implements IProjectAnalyzer {
  private bashExecutor: IBashExecutor;
  private scriptsPath: string;

  constructor(bashExecutor: IBashExecutor) {
    this.bashExecutor = bashExecutor;
    // Get the scripts directory path
    // In development (ts-node): __dirname points to src/analyzer
    // In production (compiled): __dirname points to dist/analyzer
    // Scripts are copied to dist/analyzer/scripts during build
    this.scriptsPath = path.join(__dirname, 'scripts');
    
    // Verify scripts exist, if not try alternative paths
    const fs = require('fs');
    if (!fs.existsSync(this.scriptsPath)) {
      // Try relative to project root (for development)
      const projectRoot = process.cwd();
      const altPath = path.join(projectRoot, 'src', 'analyzer', 'scripts');
      if (fs.existsSync(altPath)) {
        this.scriptsPath = altPath;
      }
    }
  }

  /**
   * Analyzes the project and returns structured metadata
   * @param projectPath Path to the project root (default: current directory)
   * @returns Promise resolving to project metadata
   */
  async analyze(projectPath: string = '.'): Promise<ProjectMetadata> {
    try {
      // Run all analysis scripts in parallel for better performance
      const [packageData, structureData, codebaseData, architectureData] = await Promise.all([
        this.runPackageAnalysis(projectPath),
        this.runStructureAnalysis(projectPath),
        this.runCodebaseAnalysis(projectPath),
        this.runArchitectureAnalysis(projectPath),
      ]);

      // Combine all data into structured metadata
      return {
        package: packageData,
        structure: structureData,
        codebase: codebaseData,
        architecture: architectureData,
      };
    } catch (error) {
      throw new Error(`Failed to analyze project: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Runs package.json analysis
   */
  private async runPackageAnalysis(projectPath: string): Promise<ProjectMetadata['package']> {
    try {
      const scriptPath = path.join(this.scriptsPath, 'analyze-package.sh');
      const output = await this.bashExecutor.execute(scriptPath, [projectPath]);
      
      if (!output || output === '{}') {
        return undefined;
      }

      return JSON.parse(output);
    } catch (error) {
      console.warn(`Warning: Failed to analyze package.json: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  /**
   * Runs structure analysis
   */
  private async runStructureAnalysis(projectPath: string): Promise<ProjectMetadata['structure']> {
    try {
      const scriptPath = path.join(this.scriptsPath, 'analyze-structure.sh');
      const output = await this.bashExecutor.execute(scriptPath, [projectPath]);
      
      const parsed = JSON.parse(output);
      return {
        directories: parsed.directories || [],
        files: parsed.files || [],
        mainFiles: parsed.mainFiles || [],
      };
    } catch (error) {
      console.warn(`Warning: Failed to analyze structure: ${error instanceof Error ? error.message : String(error)}`);
      return {
        directories: [],
        files: [],
        mainFiles: [],
      };
    }
  }

  /**
   * Runs codebase analysis
   */
  private async runCodebaseAnalysis(projectPath: string): Promise<ProjectMetadata['codebase']> {
    try {
      const scriptPath = path.join(this.scriptsPath, 'analyze-codebase.sh');
      const output = await this.bashExecutor.execute(scriptPath, [projectPath]);
      
      const parsed = JSON.parse(output);
      return {
        languages: parsed.languages || [],
        frameworks: parsed.frameworks || [],
        patterns: parsed.patterns || [],
        apiSignatures: parsed.apiSignatures || [],
      };
    } catch (error) {
      console.warn(`Warning: Failed to analyze codebase: ${error instanceof Error ? error.message : String(error)}`);
      return {
        languages: [],
        frameworks: [],
        patterns: [],
        apiSignatures: [],
      };
    }
  }

  /**
   * Runs architecture analysis
   */
  private async runArchitectureAnalysis(projectPath: string): Promise<ProjectMetadata['architecture']> {
    try {
      const scriptPath = path.join(this.scriptsPath, 'analyze-architecture.sh');
      const output = await this.bashExecutor.execute(scriptPath, [projectPath]);
      
      const parsed = JSON.parse(output);
      return {
        modules: parsed.modules || [],
        designPatterns: parsed.designPatterns || [],
        entryPoints: parsed.entryPoints || [],
        components: parsed.components || [],
        relationships: parsed.relationships || [],
      };
    } catch (error) {
      console.warn(`Warning: Failed to analyze architecture: ${error instanceof Error ? error.message : String(error)}`);
      return {
        modules: [],
        designPatterns: [],
        entryPoints: [],
        components: [],
        relationships: [],
      };
    }
  }
}

