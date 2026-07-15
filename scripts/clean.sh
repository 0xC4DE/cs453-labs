#!/usr/bin/env bash

set -euo pipefail

echo "Cleaning generated files..."

find . -type d -name node_modules -prune -exec rm -rf '{}' +
find . -type d -name coverage -prune -exec rm -rf '{}' +
find . -type d -name dist -prune -exec rm -rf '{}' +
find . -type d -name build -prune -exec rm -rf '{}' +
find . -type f -name "*.log" -delete

echo "Clean complete."
