#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Running tests for CS 453/553 labs and examples..."
echo

found=0
failed=0

while IFS= read -r package_file; do
  dir="$(dirname "$package_file")"
  found=1

  echo "========================================"
  echo "Testing: ${dir#$ROOT_DIR/}"
  echo "========================================"

  (
    cd "$dir"

    if [[ ! -d node_modules ]]; then
      echo "Installing dependencies..."
      npm install
    fi

    if npm run | grep -qE "^[[:space:]]+test"; then
      npm test
    else
      echo "No test script found. Skipping."
    fi
  ) || failed=1

  echo
done < <(
  find "$ROOT_DIR/examples" "$ROOT_DIR/labs" \
    -path "*/node_modules" -prune -o \
    -name package.json -type f -print 2>/dev/null | sort
)

if [[ "$found" -eq 0 ]]; then
  echo "No package.json files found under examples/ or labs/."
  exit 0
fi

if [[ "$failed" -ne 0 ]]; then
  echo "One or more test runs failed."
  exit 1
fi

echo "All tests passed."
