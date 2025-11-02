# briefli

[![npm version](https://img.shields.io/npm/v/briefli.svg)](https://www.npmjs.com/package/briefli) [![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**briefli** is an AI-powered README generator that creates professional, standardized README files for your projects. Simply provide your project name, description, and license - briefli analyzes your codebase and generates a complete README that follows the Standard-Readme specification.

---

## Table of Contents

- [What is briefli?](#what-is-briefli)
- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)
- [Maintainers](#maintainers)

---

## What is briefli?

Writing a good README can be time-consuming and repetitive. **briefli** solves this by:

- **Analyzing your project** - Automatically scans your codebase, dependencies, and structure
- **Using AI to generate** - Leverages Groq API with OpenAI's gpt-oss-120b model to create comprehensive READMEs
- **Following standards** - Generates READMEs that comply with the [Standard-Readme](https://github.com/RichardLitt/standard-readme) specification
- **Iterative improvements** - Review and refine the generated README until you're satisfied

Perfect for bootstrapping new projects or improving documentation for existing ones.

---

## Features

- 🤖 **AI-Powered Generation** - Uses advanced language models to create professional documentation
- 🔍 **Automatic Project Analysis** - Analyzes your codebase structure, dependencies, and patterns
- 📋 **Standard-Readme Compliant** - Follows industry-standard README format
- 🏗️ **Architecture Documentation** - Includes detailed architecture section based on your project structure
- ✨ **Interactive Workflow** - Beautiful CLI interface with guided prompts
- 🔄 **Iterative Refinement** - Review and improve the README multiple times until perfect
- 🔐 **Secure API Key Storage** - Saves your Groq API key securely in system config directory
- 🎯 **Zero Configuration** - Works out of the box, no setup required

---

## Install

### Global Installation (Recommended)

```bash
npm install -g briefli
```

This makes the `briefli` command available globally on your system.

### Local Installation

```bash
npm install --save-dev briefli
```

Then use it with `npx briefli` or `npm run briefli` if you add a script to your `package.json`.

### Requirements

- Node.js >= 18.0.0
- A Groq API key (get one at [console.groq.com](https://console.groq.com/keys))

---

## Usage

### Quick Start

1. **Get your Groq API key** from [console.groq.com/keys](https://console.groq.com/keys)

2. **Run briefli** in your project directory:
   ```bash
   briefli
   ```

3. **Follow the prompts**:
   - Enter your Groq API key (saved securely for future use)
   - Provide project name, description, and license
   - Review the generated README
   - Optionally request improvements

4. **Done!** Your README.md is generated and saved.

### What You'll See

When you run `briefli`, you'll see:

```
········································································

:                                                                      :
:                                                                      :
:   ______     ______     __     ______     ______   __         __     :
:  /\  == \   /\  == \   /\ \   /\  ___\   /\  ___\ /\ \       /\ \    :
:  \ \  __<   \ \  __<   \ \ \  \ \  __\   \ \  __\ \ \ \____  \ \ \   :
:   \ \_____\  \ \_\ \_\  \ \_\  \ \_____\  \ \_\    \ \_____\  \ \_\  :
:    \/_____/   \/_/ /_/   \/_/   \/_____/   \/_/     \/_____/   \/_/  :
:                                                                      :
:                                                                      :
········································································

                        Briefli - README Generator
```

Then the interactive flow begins!

### Example Workflow

```bash
$ briefli

# 1. API Key prompt (first time only)
Enter your Groq API key: ******
API key saved to system config

# 2. Project information
What is your project name? my-awesome-project
What is your project description? A CLI tool for managing todos
What license does your project use? MIT

# 3. Automatic analysis
Analyzing project structure...
Project analysis complete

# 4. AI generation
Generating README using AI...
Initial README generated

# 5. Review and improve (optional)
Would you like to improve the README? (y/N)
What would you like to improve or add? Add more examples

# 6. Save
Saving README.md...
README.md successfully generated
```

---

## How It Works

briefli follows a simple, intelligent workflow:

1. **Project Analysis** - Runs bash scripts to analyze:
   - Package.json (dependencies, scripts, entry points)
   - Directory structure and file organization
   - Codebase patterns and API signatures
   - Architecture and design patterns

2. **User Input** - Prompts for essential information:
   - Project name
   - Description
   - License type

3. **AI Generation** - Uses Groq API with gpt-oss-120b to generate:
   - Professional README following Standard-Readme spec
   - Complete architecture documentation
   - Installation and usage instructions
   - All required sections

4. **Iterative Improvement** - Review, refine, and regenerate until perfect

5. **Save** - Writes the final README.md to your project root

---

## Architecture

briefli is built with clean architecture principles:

### Key Components

- **Project Analyzer** - Scans your codebase using bash scripts to extract metadata
- **System Prompt Builder** - Constructs detailed prompts for the AI based on Standard-Readme spec
- **README Generator** - Coordinates AI calls and formats the output
- **Groq Client** - Interfaces with Groq API using gpt-oss-120b model
- **CLI Interface** - Beautiful interactive prompts using @clack/prompts

### Project Structure

```
briefli/
├─ bin/briefli          # CLI executable
├─ src/
│  ├─ cli/              # CLI interface and orchestration
│  ├─ analyzer/         # Project analysis logic
│  │   └─ scripts/      # Bash scripts for analysis
│  ├─ generator/        # README generation
│  ├─ prompts/          # System prompt building
│  ├─ utils/            # Utilities (Config, FileSystem, etc.)
│  └─ interfaces/        # TypeScript interfaces
└─ dist/                # Compiled output
```

### Design Principles

- **SOLID Principles** - Clean, maintainable code structure
- **Interface-Based** - Dependencies on abstractions, not implementations
- **Single Responsibility** - Each module has one clear purpose
- **Dependency Injection** - Easy to test and extend

---

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## License

Licensed under the **Apache License 2.0**. See [LICENSE](LICENSE) file for details.

---

## Maintainers

- Kartik Labhshetwar

---
