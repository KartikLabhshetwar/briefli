import { Validator } from '../utils/Validator';
import * as clack from '@clack/prompts';
import { isCancel } from '@clack/prompts';

/**
 * User prompt handlers using @clack/prompts for beautiful CLI UI
 * Follows Single Responsibility Principle - only handles user interaction
 */
export interface UserInput {
  projectName: string;
  description: string;
  license: string;
}

export interface ImprovementPrompt {
  wantsImprovement: boolean;
  improvementFeedback?: string;
}

/**
 * Prompts user for Groq API key with a nice UI
 * Saves to system config directory automatically
 */
export async function promptForApiKey(): Promise<string> {
  clack.intro('Groq API Key Required');
  clack.note('You can get your API key from: https://console.groq.com/keys', 'Get API Key');
  
  const apiKey = await clack.password({
    message: 'Enter your Groq API key:',
    validate: (input) => {
      if (!input || input.trim().length === 0) {
        return 'API key cannot be empty';
      }
      if (input.length < 20) {
        return 'API key appears to be too short (minimum 20 characters)';
      }
      return undefined;
    },
  });

  if (isCancel(apiKey)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  const trimmedApiKey = apiKey.trim();

  // Always save to system config directory
  const { Config } = await import('../utils/Config');
  const savingSpinner = clack.spinner();
  savingSpinner.start('Saving API key to system config...');
  
  try {
    await Config.saveApiKey(trimmedApiKey);
    const configPath = Config.getConfigFilePath();
    savingSpinner.stop('API key saved to system config');
    clack.note(configPath, 'Config Location');
  } catch (error) {
    savingSpinner.stop('Could not save API key');
    clack.log.warn(error instanceof Error ? error.message : String(error));
    clack.log.info('The API key will be used for this session only.');
  }

  return trimmedApiKey;
}

/**
 * Collects initial user input for project information
 */
export async function collectUserInput(): Promise<UserInput> {
  clack.intro('Project Information');

  const projectName = await clack.text({
    message: 'What is your project name?',
    validate: (input) => {
      try {
        Validator.validateProjectName(input || '');
        return undefined;
      } catch (error) {
        return error instanceof Error ? error.message : 'Invalid project name';
      }
    },
  });

  if (isCancel(projectName)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  const description = await clack.text({
    message: 'What is your project description?',
    validate: (input) => {
      try {
        Validator.validateDescription(input || '');
        return undefined;
      } catch (error) {
        return error instanceof Error ? error.message : 'Invalid description';
      }
    },
  });

  if (isCancel(description)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  const license = await clack.select({
    message: 'What license does your project use?',
    options: [
      { value: 'MIT', label: 'MIT' },
      { value: 'Apache-2.0', label: 'Apache-2.0' },
      { value: 'GPL-3.0', label: 'GPL-3.0' },
      { value: 'BSD-3-Clause', label: 'BSD-3-Clause' },
      { value: 'ISC', label: 'ISC' },
      { value: 'Unlicense', label: 'Unlicense' },
      { value: 'LGPL-3.0', label: 'LGPL-3.0' },
      { value: 'MPL-2.0', label: 'MPL-2.0' },
      { value: 'AGPL-3.0', label: 'AGPL-3.0' },
      { value: '__other__', label: 'Other (specify)' },
    ],
  });

  if (isCancel(license)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  let finalLicense = license as string;
  if (license === '__other__') {
    const customLicense = await clack.text({
      message: 'Please specify your license:',
      validate: (input) => {
        try {
          Validator.validateLicense(input || '');
          return undefined;
        } catch (error) {
          return error instanceof Error ? error.message : 'Invalid license';
        }
      },
    });

    if (isCancel(customLicense)) {
      clack.cancel('Operation cancelled.');
      process.exit(0);
    }

    finalLicense = customLicense;
  }

  return {
    projectName: projectName.trim(),
    description: description.trim(),
    license: finalLicense.trim(),
  };
}

/**
 * Prompts user if they want to improve the README
 */
export async function promptForImprovement(): Promise<ImprovementPrompt> {
  const wantsImprovement = await clack.confirm({
    message: 'Would you like to improve the README?',
    initialValue: false,
  });

  if (isCancel(wantsImprovement)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  if (!wantsImprovement) {
    return { wantsImprovement: false };
  }

  const improvementFeedback = await clack.text({
    message: 'What would you like to improve or add?',
    validate: (input) => {
      if (!input || input.trim().length === 0) {
        return 'Please provide feedback on what to improve';
      }
      return undefined;
    },
  });

  if (isCancel(improvementFeedback)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  return {
    wantsImprovement: true,
    improvementFeedback: improvementFeedback.trim(),
  };
}

/**
 * Displays the README preview to the user with a nice UI
 */
export function displayReadmePreview(readme: string): void {
  clack.intro('README Preview');
  clack.note(readme, 'Generated README');
  clack.outro('Preview generated successfully');
}
