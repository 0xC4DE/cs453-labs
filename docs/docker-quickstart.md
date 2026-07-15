# Docker Quickstart

This course uses Docker to make labs and examples run consistently across Windows, macOS, and Linux.

Docker lets us package an application with its runtime environment so that everyone can run the same service with the same commands.

## What You Need

Install one of the following:

- Windows/macOS: Docker Desktop
- Linux: Docker Engine or Docker Desktop

Official installation docs:

- Docker Get Started: https://docs.docker.com/get-started/
- Docker Engine on Linux: https://docs.docker.com/engine/install/
- Docker Desktop: https://docs.docker.com/desktop/
- Docker Compose: https://docs.docker.com/compose/install/

## Verify Docker Works

Run the following commands:

```bash
docker --version
docker compose version
docker run hello-world
```

If `hello-world` runs successfully, Docker is installed correctly.

## Common Commands

Build an image:

```bash
docker build -t cs453-example .
```

Run a container:

```bash
docker run --rm cs453-example
```

Run a web service on port 3000:

```bash
docker run --rm -p 3000:3000 cs453-example
```

Start a multi-container example:

```bash
docker compose up
```

Start in the background:

```bash
docker compose up -d
```

Stop and remove containers created by Compose:

```bash
docker compose down
```

View running containers:

```bash
docker ps
```

View all containers:

```bash
docker ps -a
```

View images:

```bash
docker images
```

Remove unused containers, images, and networks:

```bash
docker system prune
```

## Course Convention

Most examples and labs will be run from the folder containing a `Dockerfile` or `compose.yaml`.
mkdir -p docs

cat > docs/docker-quickstart.md <<'EOF'
# Docker Quickstart

This course uses Docker to make labs and examples run consistently across Windows, macOS, and Linux.

Docker lets us package an application with its runtime environment so that everyone can run the same service with the same commands.

## What You Need

Install one of the following:

- Windows/macOS: Docker Desktop
- Linux: Docker Engine or Docker Desktop

Official installation docs:

- Docker Get Started: https://docs.docker.com/get-started/
- Docker Engine on Linux: https://docs.docker.com/engine/install/
- Docker Desktop: https://docs.docker.com/desktop/
- Docker Compose: https://docs.docker.com/compose/install/

## Verify Docker Works

Run the following commands:

EOF

BT="$(printf '\140\140\140')"

cat >> docs/docker-quickstart.md <<EOF
${BT}bash
docker --version
docker compose version
docker run hello-world
${BT}

If \`hello-world\` runs successfully, Docker is installed correctly.

## Common Commands

Build an image:

${BT}bash
docker build -t cs453-example .
${BT}

Run a container:

${BT}bash
docker run --rm cs453-example
${BT}

Run a web service on port 3000:

${BT}bash
docker run --rm -p 3000:3000 cs453-example
${BT}

Start a multi-container example:

${BT}bash
docker compose up
${BT}

Start in the background:

${BT}bash
docker compose up -d
${BT}

Stop and remove containers created by Compose:

${BT}bash
docker compose down
${BT}

View running containers:

${BT}bash
docker ps
${BT}

View all containers:

${BT}bash
docker ps -a
${BT}

View images:

${BT}bash
docker images
${BT}

Remove unused containers, images, and networks:

${BT}bash
docker system prune
${BT}

## Course Convention

Most examples and labs will be run from the folder containing a \`Dockerfile\` or \`compose.yaml\`.

Example:

${BT}bash
cd labs/lab11-containerization/starter
docker compose up
${BT}

## Troubleshooting

### Permission denied on Linux

If Docker works only with \`sudo\`, your user may not be in the \`docker\` group.

${BT}bash
sudo usermod -aG docker "\$USER"
${BT}

Then log out and log back in.

### Port already in use

Another program is using the port.

Either stop the other program or change the port mapping.

Example:

${BT}yaml
ports:
  - "3001:3000"
${BT}

This maps host port \`3001\` to container port \`3000\`.

### Rebuild after changing dependencies

${BT}bash
docker compose up --build
${BT}

### Completely reset a Compose example

${BT}bash
docker compose down -v
docker compose up --build
${BT}

## Recommended Tutorial

If Docker is new to you, complete Docker's official 101 tutorial:

https://www.docker.com/101-tutorial/
EOF
Example:

```bash
cd labs/lab11-containerization/starter
docker compose up
```

## Troubleshooting

### Permission denied on Linux

If Docker works only with `sudo`, your user may not be in the `docker` group.

```bash
sudo usermod -aG docker "$USER"
```

Then log out and log back in.

### Port already in use

Another program is using the port.

Either stop the other program or change the port mapping.

Example:

```yaml
ports:
  - "3001:3000"
```

This maps host port `3001` to container port `3000`.

### Rebuild after changing dependencies

```bash
docker compose up --build
```

### Completely reset a Compose example

```bash
docker compose down -v
docker compose up --build
```

## Recommended Tutorial

If Docker is new to you, complete Docker's official 101 tutorial:

https://www.docker.com/101-tutorial/
