/**
 * Utility class for input validation
 * Follows Single Responsibility Principle - only handles validation
 */
export class Validator {
  /**
   * Validates project name
   * @param name Project name to validate
   * @returns True if valid, throws error if invalid
   */
  static validateProjectName(name: string): boolean {
    if (!name || name.trim().length === 0) {
      throw new Error('Project name cannot be empty');
    }
    
    if (name.length > 100) {
      throw new Error('Project name must be less than 100 characters');
    }
    
    return true;
  }

  /**
   * Validates project description
   * @param description Project description to validate
   * @returns True if valid, throws error if invalid
   */
  static validateDescription(description: string): boolean {
    if (!description || description.trim().length === 0) {
      throw new Error('Project description cannot be empty');
    }
    
    if (description.length > 500) {
      throw new Error('Project description must be less than 500 characters');
    }
    
    return true;
  }

  /**
   * Validates license name
   * @param license License name to validate
   * @returns True if valid, throws error if invalid
   */
  static validateLicense(license: string): boolean {
    if (!license || license.trim().length === 0) {
      throw new Error('License cannot be empty');
    }
    
    const validLicenses = [
      'MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 
      'Unlicense', 'LGPL-3.0', 'MPL-2.0', 'AGPL-3.0'
    ];
    
    if (!validLicenses.includes(license)) {
      // Warn but don't fail - allow custom licenses
      console.warn(`Warning: License "${license}" is not in the common list. Continuing anyway.`);
    }
    
    return true;
  }

  /**
   * Validates API key
   * @param apiKey API key to validate
   * @returns True if valid, throws error if invalid
   */
  static validateApiKey(apiKey: string): boolean {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('API key cannot be empty. Please set GROQ_API_KEY environment variable.');
    }
    
    if (apiKey.length < 20) {
      throw new Error('API key appears to be invalid (too short)');
    }
    
    return true;
  }
}

