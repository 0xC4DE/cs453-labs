# Setup

This document describes the basic environment needed for the CS 453/553 labs and examples.

The goal is to make sure you can clone the repository, run Node.js examples, run Docker-based examples, and submit your work correctly.

## Required Tools

You will need:

- Git
- Node.js
- npm
- Docker
- Docker Compose
- curl
- A terminal or command prompt
- A code editor such as Visual Studio Code

## Recommended Environment

Linux and macOS users can use the normal terminal.

Windows users may use one of the following:

- WSL2 with Ubuntu
- PowerShell
- Git Bash

Some networking and Docker examples may be easier in WSL2 than in a standard Windows command prompt.

## Clone the Repository

Clone the course lab repository:

```bash
git clone <repository-url>
cd cs453-labs
```

Replace `<repository-url>` with the URL provided by the instructor.

## Verify Required Tools

Run the following commands:

```bash
git --version
node --version
npm --version
docker --version
docker compose version
curl --version
```

Each command should print a version number.

If one of these commands fails, see the relevant quickstart document:

- `docs/node-quickstart.md`
- `docs/docker-quickstart.md`
- `docs/troubleshooting.md`

## Run the Environment Check Script

From the repository root, run:

```bash
./scripts/check-env.sh
```

If the script reports a missing tool, install that tool before continuing.

## Repository Layout

This repository is organized as follows:

```text
cs453-labs/
├── docs/
├── examples/
├── labs/
└── scripts/
```

The `docs/` directory contains setup and reference material.

The `examples/` directory contains small examples used for lecture, demonstration, or reference.

The `labs/` directory contains student lab starters.

The `scripts/` directory contains helper scripts.

## Typical Lab Workflow

Most labs will follow this pattern:

```bash
cd labs/labXX-name/starter
npm install
npm start
```

In another terminal, you may test the running service with `curl`, a browser, or a provided client.

To run tests:

```bash
npm test
```

## Typical Docker Workflow

Some labs and examples use Docker.

From the directory containing `compose.yaml`, run:

```bash
docker compose up --build
```

To stop the containers, press `Ctrl+C`.

To remove containers created by Compose:

```bash
docker compose down
```

## Before Asking for Help

Before asking for help, check:

1. Are you in the correct directory?
2. Did you run `npm install`?
3. Is the server actually running?
4. Is another program already using the port?
5. Does `docs/troubleshooting.md` describe the problem?

When asking for help, include:

- The lab name
- Your operating system
- The command you ran
- The full error message

## Next Steps

Read these documents as needed:

- `docs/node-quickstart.md`
- `docs/docker-quickstart.md`
- `docs/submitting-labs.md`
- `docs/troubleshooting.md`
