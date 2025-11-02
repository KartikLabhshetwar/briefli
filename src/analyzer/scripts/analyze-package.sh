#!/bin/bash
# Analyzes package.json to extract project information

PROJECT_ROOT="${1:-.}"

if [ -f "$PROJECT_ROOT/package.json" ]; then
  # Try using jq if available
  if command -v jq &> /dev/null; then
    cat "$PROJECT_ROOT/package.json" | jq -c '. | {
      name: .name // "",
      version: .version // "",
      description: .description // "",
      main: .main // "",
      scripts: .scripts // {},
      dependencies: .dependencies // {},
      devDependencies: .devDependencies // {}
    }' 2>/dev/null || echo '{}'
  else
    # Fallback: use node to parse JSON
    ABS_PATH=$(cd "$PROJECT_ROOT" 2>/dev/null && pwd || echo "$PROJECT_ROOT")
    node -e "
      try {
        const pkg = require('$ABS_PATH/package.json');
        console.log(JSON.stringify({
          name: pkg.name || '',
          version: pkg.version || '',
          description: pkg.description || '',
          main: pkg.main || '',
          scripts: pkg.scripts || {},
          dependencies: pkg.dependencies || {},
          devDependencies: pkg.devDependencies || {}
        }));
      } catch(e) {
        console.log('{}');
      }
    " 2>/dev/null || echo '{}'
  fi
else
  echo '{}'
fi

