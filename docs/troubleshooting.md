# Troubleshooting

This page lists common problems you may encounter while working on CS 453/553 labs and examples.

The general rule is:

1. Read the error message carefully.
2. Verify you are in the correct directory.
3. Verify the required tool is installed.
4. Try the simplest command that reproduces the problem.
5. Ask for help with the exact command and exact error message.

When asking for help, include:

- The lab or example name
- Your operating system
- The command you ran
- The full error message
- Any changes you made before the error occurred

## Verify Your Location

Many errors happen because commands are run from the wrong folder.

Check your current directory:

```bash
pwd
```

List the files in the current directory:

```bash
ls
```

For most labs, you should be inside a `starter/` directory before running commands such as `npm install`, `npm start`, or `docker compose up`.

Example:

```bash
cd labs/lab03-rest-api/starter
```

## Git Problems

### I cloned the wrong repo or cannot find the lab

Check the current remote:

```bash
git remote -v
```

Check the current branch:

```bash
git branch
```

Update your local copy:

```bash
git pull
```

### Git says I have local changes

Check what changed:

```bash
git status
```

See the changes:

```bash
git diff
```

If you intentionally changed files, commit them.

If you accidentally changed files, ask before deleting work.

## Node.js Problems

### node: command not found

Node.js is not installed or is not on your PATH.

Check:

```bash
which node
node --version
```

If Node.js is not installed, follow `docs/node-quickstart.md`.

### npm: command not found

npm is not installed or is not on your PATH.

Check:

```bash
which npm
npm --version
```

npm normally installs with Node.js.

### npm install fails

First, make sure you are in the folder containing `package.json`:

```bash
ls package.json
```

Then try:

```bash
npm install
```

If dependencies seem corrupted, try a clean installation:

```bash
rm -rf node_modules package-lock.json
npm install
```

### npm start fails

Make sure `package.json` has a `start` script:

```bash
cat package.json
```

You should see something like:

```json
{
  "scripts": {
    "start": "node src/index.js"
  }
}
```

### ES module import error

If you see an error involving `import`, check whether `package.json` contains:

```json
{
  "type": "module"
}
```

If the lab starter code uses `import`, the project usually needs `"type": "module"`.

## Port Problems

### Port already in use

Another process is already using the port.

For example, if port 3000 is busy:

```bash
lsof -i :3000
```

You can either stop the other process or change the port used by your application.

Common ports in this course may include:

```text
3000  Node/Express apps
3001  alternate Node app
4000  GraphQL examples
5672  RabbitMQ
15672 RabbitMQ management UI
8080  general web examples
```

### curl cannot connect

If `curl` cannot connect, make sure the server is actually running.

In one terminal:

```bash
npm start
```

In another terminal:

```bash
curl http://localhost:3000
```

If the server is not running, `curl` cannot reach it.

## Docker Problems

### docker: command not found

Docker is not installed or is not on your PATH.

Check:

```bash
which docker
docker --version
```

Follow `docs/docker-quickstart.md`.

### Docker works only with sudo on Linux

Your user may not be in the `docker` group.

Run:

```bash
sudo usermod -aG docker "$USER"
```

Then log out and log back in.

### docker compose does not work

Check:

```bash
docker compose version
```

Modern Docker uses:

```bash
docker compose
```

Older systems sometimes used:

```bash
docker-compose
```

Use the command shown in the lab instructions.

### Container starts but the app is not reachable

Check the port mapping.

Example:

```yaml
ports:
  - "3000:3000"
```

The first number is the port on your computer.

The second number is the port inside the container.

### Rebuild a Docker example

If dependencies or Docker files changed, rebuild:

```bash
docker compose up --build
```

### Reset a Docker Compose example

Warning: this may delete local container data and volumes for the example.

```bash
docker compose down -v
docker compose up --build
```

### Clean unused Docker resources

Warning: this removes unused Docker objects.

```bash
docker system prune
```

## HTTP and REST Problems

### 404 Not Found

The server is running, but the route does not exist.

Check:

- The URL path
- The HTTP method
- The route definition in the server code

For example, these are different routes:

```text
GET /items
POST /items
GET /items/1
```

### 500 Internal Server Error

The server received the request, but the server code crashed or threw an error.

Check the terminal where the server is running.

Look for stack traces or logged errors.

### JSON parse error

Make sure the request body is valid JSON.

Example valid JSON:

```json
{
  "name": "example",
  "complete": false
}
```

Common mistake:

```json
{
  "name": "example"
}
```

JSON keys must be quoted.

### Missing Content-Type header

When sending JSON with `curl`, include the content type:

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"example"}'
```

## WebSocket Problems

### WebSocket connection fails

Check that:

- The WebSocket server is running
- The port is correct
- The URL starts with `ws://` or `wss://`
- The server and client are using the same path

Example:

```text
ws://localhost:3000
```

or:

```text
ws://localhost:3000/events
```

### Browser blocks the connection

If the page is loaded over HTTPS, the browser may block insecure `ws://` connections.

Use `wss://` for secure WebSocket connections in deployed environments.

For local labs, use local HTTP and local WebSocket URLs unless the lab says otherwise.

## RabbitMQ / Message Queue Problems

### RabbitMQ container is not ready yet

Message brokers may take a few seconds to start.

Check logs:

```bash
docker compose logs rabbitmq
```

### Cannot connect to RabbitMQ

Check the hostname and port.

From your host machine, RabbitMQ is commonly available at:

```text
localhost:5672
```

From another container in the same Compose network, the hostname is often the service name:

```text
rabbitmq:5672
```

### RabbitMQ management UI

If enabled, the management UI is often available at:

```text
http://localhost:15672
```

The default development credentials are often:

```text
guest / guest
```

Use only the credentials specified by the lab.

## Testing Problems

### Tests fail immediately

Make sure dependencies are installed:

```bash
npm install
```

Then run:

```bash
npm test
```

### Tests cannot find a file

Check whether the file exists:

```bash
ls
find . -maxdepth 3 -type f
```

Also check spelling and capitalization. Linux file names are case-sensitive.

### Tests hang and never finish

Common causes:

- A server was started but never stopped
- A socket remains open
- A database or message queue connection remains open
- A promise never resolves

Look for missing cleanup code in tests.

## Line Ending Problems

Windows and Linux use different default line endings.

If a shell script gives a strange error such as `bad interpreter`, it may have Windows line endings.

Fix with:

```bash
dos2unix script-name.sh
```

or:

```bash
sed -i 's/\r$//' script-name.sh
```

Make the script executable:

```bash
chmod +x script-name.sh
```

## Permission Problems

### Script is not executable

Run:

```bash
chmod +x script-name.sh
```

Then run:

```bash
./script-name.sh
```

### Permission denied when editing files

Check file ownership:

```bash
ls -la
```

Avoid using `sudo` inside your project folder unless the instructor specifically tells you to.

## Asking for Help

When asking for help, do not say only "it does not work."

Include the exact command and exact output.

Good example:

```text
Lab: lab03-rest-api
OS: Pop!_OS 22.04
Directory: labs/lab03-rest-api/starter

Command:
npm start

Error:
Error: Cannot find module 'express'
```

This gives enough information to start troubleshooting quickly.
