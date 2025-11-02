#!/bin/bash
# Analyzes codebase to detect languages, frameworks, patterns, and API signatures

PROJECT_ROOT="${1:-.}"

# Detect languages by file extensions
LANGUAGES=()
[ $(find "$PROJECT_ROOT" -name "*.ts" -not -path "*/node_modules/*" | head -1 | wc -l) -gt 0 ] && LANGUAGES+=("TypeScript")
[ $(find "$PROJECT_ROOT" -name "*.js" -not -path "*/node_modules/*" -not -name "*.min.js" | head -1 | wc -l) -gt 0 ] && LANGUAGES+=("JavaScript")
[ $(find "$PROJECT_ROOT" -name "*.py" -not -path "*/node_modules/*" -not -path "*/.venv/*" | head -1 | wc -l) -gt 0 ] && LANGUAGES+=("Python")
[ $(find "$PROJECT_ROOT" -name "*.java" -not -path "*/node_modules/*" | head -1 | wc -l) -gt 0 ] && LANGUAGES+=("Java")
[ $(find "$PROJECT_ROOT" -name "*.go" -not -path "*/node_modules/*" | head -1 | wc -l) -gt 0 ] && LANGUAGES+=("Go")
[ $(find "$PROJECT_ROOT" -name "*.rs" -not -path "*/node_modules/*" | head -1 | wc -l) -gt 0 ] && LANGUAGES+=("Rust")

# Detect frameworks by file/directory presence
FRAMEWORKS=()
[ -f "$PROJECT_ROOT/package.json" ] && grep -q "react" "$PROJECT_ROOT/package.json" 2>/dev/null && FRAMEWORKS+=("React")
[ -f "$PROJECT_ROOT/package.json" ] && grep -q "vue" "$PROJECT_ROOT/package.json" 2>/dev/null && FRAMEWORKS+=("Vue")
[ -f "$PROJECT_ROOT/package.json" ] && grep -q "angular" "$PROJECT_ROOT/package.json" 2>/dev/null && FRAMEWORKS+=("Angular")
[ -f "$PROJECT_ROOT/package.json" ] && grep -q "express" "$PROJECT_ROOT/package.json" 2>/dev/null && FRAMEWORKS+=("Express")
[ -f "$PROJECT_ROOT/package.json" ] && grep -q "next" "$PROJECT_ROOT/package.json" 2>/dev/null && FRAMEWORKS+=("Next.js")
[ -f "$PROJECT_ROOT/next.config.*" ] 2>/dev/null && FRAMEWORKS+=("Next.js")
[ -f "$PROJECT_ROOT/tsconfig.json" ] && FRAMEWORKS+=("TypeScript")

# Detect patterns
PATTERNS=()
[ $(find "$PROJECT_ROOT/src" -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -l "class.*implements" 2>/dev/null | head -1 | wc -l) -gt 0 ] && PATTERNS+=("Interface Implementation")
[ $(find "$PROJECT_ROOT/src" -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -l "export.*class" 2>/dev/null | head -1 | wc -l) -gt 0 ] && PATTERNS+=("Class-based")
[ $(find "$PROJECT_ROOT/src" -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -l "export.*function" 2>/dev/null | head -1 | wc -l) -gt 0 ] && PATTERNS+=("Functional")
[ $(find "$PROJECT_ROOT/src" -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -l "export.*interface" 2>/dev/null | head -1 | wc -l) -gt 0 ] && PATTERNS+=("Type Definitions")
[ $(find "$PROJECT_ROOT/src" -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -l "async.*=>" 2>/dev/null | head -1 | wc -l) -gt 0 ] && PATTERNS+=("Async/Await")

# Extract API signatures (exported functions/classes)
API_SIGNATURES=$(find "$PROJECT_ROOT/src" -name "*.ts" -o -name "*.js" 2>/dev/null | head -20 | xargs grep -h "^export" 2>/dev/null | head -30 | sed 's/^[[:space:]]*//' | head -30)

echo "{"
echo "\"languages\":["
for lang in "${LANGUAGES[@]}"; do
  echo "\"$lang\","
done | sed '$ s/,$//'
echo "],"
echo "\"frameworks\":["
for fw in "${FRAMEWORKS[@]}"; do
  echo "\"$fw\","
done | sed '$ s/,$//'
echo "],"
echo "\"patterns\":["
for pattern in "${PATTERNS[@]}"; do
  echo "\"$pattern\","
done | sed '$ s/,$//'
echo "],"
echo "\"apiSignatures\":["
echo "$API_SIGNATURES" | while IFS= read -r sig; do
  if [ -n "$sig" ]; then
    # Escape quotes and newlines for JSON
    sig_escaped=$(echo "$sig" | sed 's/"/\\"/g' | tr '\n' ' ' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    if [ -n "$sig_escaped" ]; then
      echo "\"$sig_escaped\","
    fi
  fi
done | sed '$ s/,$//'
echo "]"
echo "}"

