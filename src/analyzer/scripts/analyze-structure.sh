#!/bin/bash
# Analyzes project directory structure

PROJECT_ROOT="${1:-.}"

# Get all directories (excluding node_modules, .git, dist, etc.)
DIRECTORIES=$(find "$PROJECT_ROOT" -type d -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/.next/*" -not -path "*/build/*" -not -path "*/.env*" | sed "s|^$PROJECT_ROOT/||" | sed "s|^\./||" | head -50)

# Get key files (excluding node_modules, .git, dist, etc.)
FILES=$(find "$PROJECT_ROOT" -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/.next/*" -not -path "*/build/*" -not -name "*.log" -not -name ".DS_Store" | sed "s|^$PROJECT_ROOT/||" | sed "s|^\./||" | head -100)

# Get main entry files
MAIN_FILES=$(find "$PROJECT_ROOT" -type f \( -name "index.*" -o -name "main.*" -o -name "app.*" -o -name "server.*" \) -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" | sed "s|^$PROJECT_ROOT/||" | sed "s|^\./||" | head -20)

echo "{\"directories\":["
echo "$DIRECTORIES" | while IFS= read -r dir; do
  if [ -n "$dir" ]; then
    echo "\"$dir\","
  fi
done | sed '$ s/,$//'
echo "],\"files\":["
echo "$FILES" | while IFS= read -r file; do
  if [ -n "$file" ]; then
    echo "\"$file\","
  fi
done | sed '$ s/,$//'
echo "],\"mainFiles\":["
echo "$MAIN_FILES" | while IFS= read -r file; do
  if [ -n "$file" ]; then
    echo "\"$file\","
  fi
done | sed '$ s/,$//'
echo "]}"

