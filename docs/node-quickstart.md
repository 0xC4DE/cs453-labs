# Node.js Quickstart

This course uses Node.js for many of the client/server programming examples and labs.

Node.js lets us run JavaScript outside the browser. We will use it to build TCP servers, HTTP services, REST APIs, WebSocket servers, and small service-to-service examples.

## What You Need

Install a current Long-Term Support version of Node.js.

Recommended:

- Node.js 20 LTS or newer
- npm, which normally installs with Node.js

You can check your versions with the commands below.

```bash
node --version
npm --version
```

You should see version numbers printed for both commands.

## Installing Node.js

### Linux

On Ubuntu or Pop!_OS, you can install Node.js from your package manager, but the version may be older than desired.

For this course, using `nvm` is often the cleanest option because it lets you manage Node versions per user.

Install or update `nvm` by following the official instructions:

https://github.com/nvm-sh/nvm

After installing `nvm`, open a new terminal and run:

```bash
nvm install --lts
nvm use --lts
node --version
npm --version
```

### Windows and macOS

Install Node.js from:

https://nodejs.org/

Choose the LTS version unless your instructor gives different instructions.

## Creating a New Node Project

Create a folder:

```bash
mkdir hello-node
cd hello-node
```

Initialize a Node project:

```bash
npm init -y
```

This creates a `package.json` file.

## Running a Simple Program

Create a file named `index.js`:

```bash
cat > index.js <<'JS'
console.log("Hello from Node.js");
JS
```

Run it:

```bash
node index.js
```

Expected output:

```text
Hello from Node.js
```

## Using npm Scripts

Open `package.json` and add a `start` script:

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

Then run:

```bash
npm start
```

In this course, many labs will use npm scripts such as:

```bash
npm start
npm test
npm run dev
```

## Installing Packages

Install a package with:

```bash
npm install package-name
```

For example, to install Express:

```bash
npm install express
```

This updates `package.json` and creates or updates `package-lock.json`.

The `node_modules/` folder contains installed packages. It should not be committed to Git.

## Common Project Layout

Many examples and labs will use a structure similar to this:

```text
starter/
├── package.json
├── package-lock.json
├── src/
│   └── index.js
└── test/
    └── example.test.js
```

The main code usually goes in `src/`.

Tests usually go in `test/`.

## ES Modules

Many course examples use ES module syntax:

```javascript
import express from "express";
```

To enable this style, `package.json` should include:

```json
{
  "type": "module"
}
```

Without this setting, Node.js expects older CommonJS syntax:

```javascript
const express = require("express");
```

Use the style shown in each lab's starter code.

## Basic HTTP Server Example

Create `server.js`:

```bash
cat > server.js <<'JS'
import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Hello from Node.js" }));
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
JS
```

Create or update `package.json`:

```bash
cat > package.json <<'JSON'
{
  "name": "node-http-example",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  }
}
JSON
```

Run the server:

```bash
npm start
```

In another terminal, test it:

```bash
curl http://localhost:3000
```

Expected output:

```json
{"message":"Hello from Node.js"}
```

Stop the server with `Ctrl+C`.

## Running Tests

Node.js includes a built-in test runner.

Example test file:

```javascript
import test from "node:test";
import assert from "node:assert/strict";

test("basic math works", () => {
  assert.equal(2 + 2, 4);
});
```

A typical test script in `package.json`:

```json
{
  "scripts": {
    "test": "node --test"
  }
}
```

Run tests with:

```bash
npm test
```

## Common Commands

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

Run tests:

```bash
npm test
```

Install a new dependency:

```bash
npm install express
```

Install a development dependency:

```bash
npm install --save-dev nodemon
```

Remove installed dependencies and start fresh:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Troubleshooting

### Command not found: node

Node.js is not installed or is not on your PATH.

Check:

```bash
which node
node --version
```

### Command not found: npm

npm is not installed or is not on your PATH.

Check:

```bash
which npm
npm --version
```

### Port already in use

Another process is already using the port.

For example, if port 3000 is busy, stop the other process or use a different port.

On Linux/macOS:

```bash
lsof -i :3000
```

### Dependencies are broken or strange

Try a clean install:

```bash
rm -rf node_modules package-lock.json
npm install
```

### ES module import error

If you see an error involving `import`, check whether `package.json` contains:

```json
{
  "type": "module"
}
```

## Course Convention

Most Node labs will be run from the lab's `starter/` directory.

Example:

```bash
cd labs/lab03-rest-api/starter
npm install
npm start
```

For testing:

```bash
npm test
```

## Recommended References

- Node.js official site: https://nodejs.org/
- Node.js documentation: https://nodejs.org/docs/latest/api/
- npm documentation: https://docs.npmjs.com/
- Express documentation: https://expressjs.com/
