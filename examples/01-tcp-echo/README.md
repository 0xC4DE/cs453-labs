# Example 01 - TCP Echo Server

This example demonstrates a simple TCP client/server application using Node.js.

The server accepts a client connection, reads text from the client, and sends the same text back.

## Learning Goals

- Understand the basic client/server model
- Start a TCP server
- Connect to a TCP server from a client
- Send and receive text over a socket
- Observe connection and disconnection events

## Run the Server

From this directory:

```bash
npm run server
```

Expected output:

```text
Echo server listening on 127.0.0.1:3000
```

## Run the Client

Open a second terminal and run:

```bash
npm run client
```

Type messages and press Enter.

Example:

```text
> hello
Echo: hello
```

To disconnect:

```text
> QUIT
Goodbye.
```

## Try With netcat

Instead of using the provided client, you can also connect with `nc`:

```bash
nc 127.0.0.1 3000
```

Then type messages and press Enter.

## Changing the Port

The default port is `3000`.

To use a different port:

```bash
PORT=4000 npm run server
```

Then in another terminal:

```bash
PORT=4000 npm run client
```

## Discussion Questions

1. Which program is the server?
2. Which program is the client?
3. What happens when the client sends `QUIT`?
4. What happens if two clients connect at the same time?
5. How is this different from HTTP?
