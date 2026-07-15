#!/usr/bin/env bash

set -euo pipefail

echo "Checking CS 453/553 lab environment..."
echo

check_command() {
  local command_name="$1"

  if command -v "$command_name" >/dev/null 2>&1; then
    echo "Found $command_name: $($command_name --version 2>/dev/null | head -n 1)"
  else
    echo "Missing $command_name"
    return 1
  fi
}

missing=0

check_command git || missing=1
check_command node || missing=1
check_command npm || missing=1
check_command docker || missing=1
check_command curl || missing=1

echo

if docker compose version >/dev/null 2>&1; then
  echo "Found docker compose: $(docker compose version)"
else
  echo "Missing docker compose"
  missing=1
fi

echo

if [[ "$missing" -eq 0 ]]; then
  echo "Environment looks good."
else
  echo "One or more required tools are missing."
  echo "See docs/setup.md, docs/node-quickstart.md, and docs/docker-quickstart.md."
  exit 1
fi
