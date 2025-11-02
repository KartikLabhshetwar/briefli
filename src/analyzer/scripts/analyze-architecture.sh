#!/bin/bash
# Analyzes project architecture: modules, design patterns, entry points, components, relationships

PROJECT_ROOT="${1:-.}"

# Find modules (directories with index files or main files)
MODULES=$(find "$PROJECT_ROOT/src" -type f \( -name "index.*" -o -name "*.ts" -o -name "*.js" \) -not -path "*/node_modules/*" 2>/dev/null | \
  xargs dirname 2>/dev/null | sort -u | sed "s|^$PROJECT_ROOT/||" | sed "s|^\./||" | head -30)

# Detect design patterns
DESIGN_PATTERNS=()
[ $(find "$PROJECT_ROOT/src" -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -l "interface.*{" 2>/dev/null | head -1 | wc -l) -gt 0 ] && DESIGN_PATTERNS+=("Interface-based Design")
[ $(find "$PROJECT_ROOT/src" -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -l "abstract.*class" 2>/dev/null | head -1 | wc -l) -gt 0 ] && DESIGN_PATTERNS+=("Abstract Classes")
[ $(find "$PROJECT_ROOT/src" -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -l "extends" 2>/dev/null | head -1 | wc -l) -gt 0 ] && DESIGN_PATTERNS+=("Inheritance")
[ $(find "$PROJECT_ROOT/src" -type d -name "utils" -o -name "helpers" -o -name "services" 2>/dev/null | head -1 | wc -l) -gt 0 ] && DESIGN_PATTERNS+=("Layered Architecture")
[ -d "$PROJECT_ROOT/src/interfaces" ] && DESIGN_PATTERNS+=("Dependency Inversion")
[ -d "$PROJECT_ROOT/src/cli" ] && DESIGN_PATTERNS+=("Command Pattern")

# Find entry points
ENTRY_POINTS=$(find "$PROJECT_ROOT" -type f \( -name "index.*" -o -name "main.*" -o -name "app.*" -o -name "server.*" \) \
  -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" 2>/dev/null | \
  sed "s|^$PROJECT_ROOT/||" | sed "s|^\./||" | head -10)

# Find components (files with classes or exported objects)
COMPONENTS=$(find "$PROJECT_ROOT/src" -type f \( -name "*.ts" -o -name "*.js" \) -not -path "*/node_modules/*" 2>/dev/null | \
  while read file; do
    basename_file=$(basename "$file" .ts | basename .js)
    if grep -q "^export.*class\|^export.*interface\|^export.*const\|^export.*function" "$file" 2>/dev/null; then
      type=""
      grep -q "^export.*class" "$file" 2>/dev/null && type="class"
      grep -q "^export.*interface" "$file" 2>/dev/null && type="interface"
      [ -z "$type" ] && type="module"
      echo "{\"name\":\"$basename_file\",\"type\":\"$type\",\"path\":\"$(echo "$file" | sed "s|^$PROJECT_ROOT/||" | sed "s|^\./||")\"}"
    fi
  done | head -50)

# Simple relationship detection (import/require statements)
RELATIONSHIPS=$(find "$PROJECT_ROOT/src" -type f \( -name "*.ts" -o -name "*.js" \) -not -path "*/node_modules/*" 2>/dev/null | \
  while read file; do
    from=$(basename "$file" .ts | basename .js)
    grep -h "^import.*from\|require(" "$file" 2>/dev/null | \
      sed "s/.*from ['\"]\.\/\(.*\)['\"].*/\1/" | \
      sed "s/.*from ['\"]\.\.\/\(.*\)['\"].*/\1/" | \
      sed "s/.*require(['\"]\.\/\(.*\)['\"].*/\1/" | \
      while read to; do
        if [ -n "$to" ] && [ "$to" != "$from" ]; then
          to_base=$(basename "$to" .ts | basename .js)
          echo "{\"from\":\"$from\",\"to\":\"$to_base\",\"type\":\"import\"}"
        fi
      done
  done | head -50)

echo "{"
echo "\"modules\":["
echo "$MODULES" | while IFS= read -r module; do
  if [ -n "$module" ]; then
    echo "\"$module\","
  fi
done | sed '$ s/,$//'
echo "],"
echo "\"designPatterns\":["
for pattern in "${DESIGN_PATTERNS[@]}"; do
  echo "\"$pattern\","
done | sed '$ s/,$//'
echo "],"
echo "\"entryPoints\":["
echo "$ENTRY_POINTS" | while IFS= read -r entry; do
  if [ -n "$entry" ]; then
    echo "\"$entry\","
  fi
done | sed '$ s/,$//'
echo "],"
echo "\"components\":["
echo "$COMPONENTS" | head -30 | while IFS= read -r component; do
  if [ -n "$component" ]; then
    echo "$component,"
  fi
done | sed '$ s/,$//'
echo "],"
echo "\"relationships\":["
echo "$RELATIONSHIPS" | head -30 | while IFS= read -r rel; do
  if [ -n "$rel" ]; then
    echo "$rel,"
  fi
done | sed '$ s/,$//'
echo "]"
echo "}"

