#!/usr/bin/env node

import { collectUserInput, promptForImprovement, displayReadmePreview, promptForApiKey, UserInput } from './prompts';
import { ProjectAnalyzer } from '../analyzer/ProjectAnalyzer';
import { BashExecutor } from '../utils/BashExecutor';
import { ReadmeGenerator } from '../generator/ReadmeGenerator';
import { GroqClient } from '../generator/GroqClient';
import { FileSystem } from '../utils/FileSystem';
import { Config } from '../utils/Config';
import * as path from 'path';
import * as clack from '@clack/prompts';
import { isCancel } from '@clack/prompts';

/**
 * Main CLI orchestrator
 * Follows Single Responsibility Principle - orchestrates the workflow
 * Uses Dependency Inversion - depends on abstractions
 */
export class CLI {
  private readmeGenerator!: ReadmeGenerator; // Initialized in initializeReadmeGenerator()
  private projectAnalyzer: ProjectAnalyzer;
  private fileSystem: FileSystem;
  private apiKey: string;
  private projectRoot: string;

  constructor(apiKey?: string) {
    // API key must be provided via parameter or will be prompted from user
    this.apiKey = apiKey || '';
    this.projectRoot = Config.getProjectRoot();
    
    // Initialize dependencies (readmeGenerator will be initialized after API key is obtained)
    const bashExecutor = new BashExecutor();
    this.projectAnalyzer = new ProjectAnalyzer(bashExecutor);
    this.fileSystem = new FileSystem();
  }

  /**
   * Initializes the readme generator with the API key
   */
  private initializeReadmeGenerator(): void {
    const apiClient = new GroqClient(this.apiKey);
    this.readmeGenerator = new ReadmeGenerator(apiClient);
  }


  /**
   * Runs the complete CLI workflow
   */
  async run(): Promise<void> {
    try {
      // Show ASCII art banner every time
      console.log('');
      console.log('········································································');
      console.log('');
      console.log(':                                                                      :');
      console.log(':                                                                      :');
      console.log(':   ______     ______     __     ______     ______   __         __     :');
      console.log(':  /\\  == \\   /\\  == \\   /\\ \\   /\\  ___\\   /\\  ___\\ /\\ \\       /\\ \\    :');
      console.log(':  \\ \\  __<   \\ \\  __<   \\ \\ \\  \\ \\  __\\   \\ \\  __\\ \\ \\ \\____  \\ \\ \\   :');
      console.log(':   \\ \\_____\\  \\ \\_\\ \\_\\  \\ \\_\\  \\ \\_____\\  \\ \\_\\    \\ \\_____\\  \\ \\_\\  :');
      console.log(':    \\/_____/   \\/_/ /_/   \\/_/   \\/_____/   \\/_/     \\/_____/   \\/_/  :');
      console.log(':                                                                      :');
      console.log(':                                                                      :');
      console.log('········································································');
      console.log('');
      console.log('                        Briefli - README Generator');
      console.log('');

      // Check if README already exists
      const readmePath = path.join(this.projectRoot, 'README.md');
      const readmeExists = await this.fileSystem.fileExists(readmePath);
      
      if (readmeExists) {
        const shouldRegenerate = await clack.confirm({
          message: 'README.md already exists. Do you want to regenerate it?',
          initialValue: false,
        });

        if (isCancel(shouldRegenerate)) {
          clack.cancel('Operation cancelled.');
          process.exit(0);
        }
        
        if (!shouldRegenerate) {
          clack.outro('Exiting without regenerating README.');
          return;
        }
      }

      // Step 0: Get API key (check system config first, then prompt if not found)
      if (!this.apiKey || this.apiKey.length === 0) {
        // Try to load from system config file
        const savedApiKey = Config.getApiKey();
        if (savedApiKey) {
          clack.log.success('API key found in system config');
          this.apiKey = savedApiKey;
        } else {
          this.apiKey = await promptForApiKey();
        }
      }
      
      // Validate API key
      const { Validator } = require('../utils/Validator');
      Validator.validateApiKey(this.apiKey);
      
      // Initialize readme generator with API key
      this.initializeReadmeGenerator();

      // Step 1: Collect user input
      const userInput = await collectUserInput();

      // Step 2: Analyze project
      const analyzeSpinner = clack.spinner();
      analyzeSpinner.start('Analyzing project structure...');
      const metadata = await this.projectAnalyzer.analyze(this.projectRoot);
      analyzeSpinner.stop('Project analysis complete');

      // Step 3: Generate initial README
      const generateSpinner = clack.spinner();
      generateSpinner.start('Generating README using AI...');
      let readme = await this.readmeGenerator.generateInitial(
        userInput.projectName,
        userInput.description,
        userInput.license,
        metadata
      );
      generateSpinner.stop('Initial README generated');

      // Step 4: Display preview and improvement loop
      let improvementCount = 0;
      while (true) {
        displayReadmePreview(readme);

        const improvement = await promptForImprovement();

        if (!improvement.wantsImprovement) {
          break;
        }

        if (!improvement.improvementFeedback) {
          continue;
        }

        improvementCount++;
        const improveSpinner = clack.spinner();
        improveSpinner.start(`Improving README (iteration ${improvementCount})...`);
        
        readme = await this.readmeGenerator.improve(
          userInput.projectName,
          userInput.description,
          userInput.license,
          metadata,
          readme,
          improvement.improvementFeedback
        );
        improveSpinner.stop(`README improved (iteration ${improvementCount})`);
      }

      // Step 5: Write README to file
      const saveSpinner = clack.spinner();
      saveSpinner.start('Saving README.md...');
      await this.fileSystem.writeFile(readmePath, readme);
      saveSpinner.stop('README.md saved');

      clack.outro(
        `README.md successfully generated at ${readmePath}` +
        (improvementCount > 0 ? ` (${improvementCount} improvement${improvementCount > 1 ? 's' : ''})` : '')
      );
    } catch (error) {
      clack.log.error(error instanceof Error ? error.message : String(error));
      clack.cancel('Operation failed.');
      process.exit(1);
    }
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  const cli = new CLI();
  cli.run().catch((error) => {
    clack.log.error(error instanceof Error ? error.message : String(error));
    clack.cancel('Fatal error occurred.');
    process.exit(1);
  });
}
