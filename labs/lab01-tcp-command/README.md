# Lab 1 - TCP Command Server

## Required Features

1. The server must accept TCP client connections on a configurable port.
2. The client must send one command at a time.
3. The server must support `ECHO`, `UPPER`, `LOWER`, and `QUIT`.
4. The server must return an error for unknown commands.
5. The server must not crash when the client sends an empty line.
6. The README must describe the protocol.
7. Implement `REVERSE` or `TIME` or add a new command and document it. 

## Command Protocol

The server accepts one text command per line.

Commands are case-insensitive, but the command arguments should be handled as normal text.

| Client sends    | Server responds     |
| --------------- | ------------------- |
| `ECHO hello`    | `hello`             |
| `UPPER hello`   | `HELLO`             |
| `LOWER HELLO`   | `hello`             |
| `REVERSE hello` | `olleh`             |
| `TIME`          | current server time |
| `QUIT`          | closes connection   |
| unknown command | error message       |

## Running the Lab

First, move into the directory:

```
cd labs/lab01-tcp-command/
```

Install dependencies:

```
npm install
```

Start the server:

```
npm run server
```

In a second terminal, move into the same starter directory and run the client:

```
npm run client
```

You should be able to type commands into the client and see responses from the server.

Example:

```
> ECHO hello
hello

> UPPER hello
HELLO

> QUIT
Goodbye.
```

## Testing

Run the tests from the starter directory:
```
npm test
```

The tests are focused on `src/commands.js`.

## Reflection Questions

Answer the following questions in your submission:

1. What is the difference between the client and the server?
The client calls the server to open the socket, the socket is handled directly by the server using an event queue that NodeJS handles natively.

2. Why does the server need to keep running after handling one request?
So that the client can keep sending more requests.

3. What happens if two clients connect at the same time?
A second socket is spawned so that the second client can communicate with the server. The second client is on it's own ephemeral port. This is allowed because NodeJS has an underlying event-based queue for TCP messages.

4. How is this different from HTTP?
This is different from HTTP because it is simply a raw socket. While HTTP does use TCP sockets to communicate, HTTP is generally a one-way conenction e.g. the client requests from the server and the server sends the text, and then the connection is over. This server handles the raw sockets and they are kept alive until terminated.

## Submission

Submit your completed lab according to the course submission instructions.

Your submission should include:

* Your updated source code.
* Your completed `commands.js`.
* Your updated README protocol description.
* Your answers to the reflection questions.
* Any graduate extension work, if applicable.

Before submitting, verify that:

```
npm test
```

runs successfully.
