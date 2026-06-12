# Lab 2 - Hello HTTP + JSON

In Lab 1, you worked directly with a TCP socket and created a small command-based server.

In this lab, you will move up one layer and build a small HTTP JSON service. Instead of inventing your own command format, you will use HTTP methods, paths, status codes, headers, and JSON request/response bodies.

## Learning Goals

By the end of this lab, you should be able to:

* Explain the difference between a raw TCP message and an HTTP request.
* Create a basic HTTP server in Node.js.
* Read the HTTP method and request path.
* Parse a JSON request body.
* Return JSON responses.
* Use appropriate HTTP status codes.
* Handle invalid or unexpected client input without crashing the server.
* Test HTTP request-handling behavior.

## Starter Code Structure

The starter code is located in:

```text
labs/lab02-http-json/starter/
```

The starter project has this structure:

```text
starter/
├── package.json
├── src/
│   └── server.js
└── test/
    └── server.test.js
```

### File Descriptions

| File                  | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `src/server.js`       | Starts the HTTP server and handles incoming HTTP requests. |
| `test/server.test.js` | Contains automated tests for the HTTP JSON service.        |
| `package.json`        | Defines project metadata, dependencies, and npm scripts.   |

## Features/Endpoints

### `GET /health`

Returns a JSON response showing that the server is running.

Example response:

```json
{
  "status": "ok"
}
```

### `POST /echo`

Accepts a JSON request body and returns the same data back to the client.

Example request body:

```json
{
  "message": "hello"
}
```

Example response:

```json
{
  "message": "hello"
}
```

### `POST /calculate`

Accepts a JSON request body with an operation and two numbers.

Example request body:

```json
{
  "operation": "add",
  "a": 2,
  "b": 3
}
```

Example response:

```json
{
  "result": 5
}
```

Supports the following operations:

| Operation  | Meaning               |
| ---------- | --------------------- |
| `add`      | Add `a` and `b`       |
| `subtract` | Subtract `b` from `a` |
| `multiply` | Multiply `a` and `b`  |
| `divide`   | Divide `a` by `b`     |
| `remainder`| Returns `a` mod `b`   |

The server should return an error response for unsupported operations.

### `GET /requests`

Returns information about how many requests the server has handled since it started.

Example response:

```json
{
  "count": 4
}
```

### `GET /time`

Returns the current time as an ISO string.

Example response:

```json
{
    "time":"2026-06-12T16:29:12.560Z"
}
```


## Running the Lab

First, move into the directory:

```bash
cd labs/lab02-http-json/
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run server
```

By default, the server should listen on port `3000`.

You can test the server in a browser by visiting:

```text
http://localhost:3000/health
```

You can also test it with `curl`.

Example:

```bash
curl http://localhost:3000/health
```

Example `POST /echo` request:

```bash
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```

Example `POST /calculate` request:

```bash
curl -X POST http://localhost:3000/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","a":2,"b":3}'
```

## Configuring the Port

The server should use port `3000` by default.

You can run the server on a different port by setting the `PORT` environment variable:

```bash
PORT=4000 npm run server
```

Then send requests to the new port:

```bash
curl http://localhost:4000/health
```

## Testing

This lab includes automated tests for the HTTP JSON service.

Run the tests from the starter directory:

```bash
npm test
```

The tests should check behavior such as:

* `GET /health` returns a JSON status response.
* `POST /echo` returns the submitted JSON data.
* `POST /calculate` performs supported calculations.
* Unknown routes return an error.
* Invalid JSON returns an error.
* The server does not crash on bad input.

## Reflection Questions

Answer the following questions in your submission:

1. What is the difference between a TCP message and an HTTP request?

TCP Messages are just raw data sent over a socket, and HTTP request is an actual protocol with a standard way of denoting which messages are sent. HTTP messages are usually transferred over a TCP socket.


2. What does the `Content-Type: application/json` header tell the server?

It tells the server that you are sending it JSON content inside of your message body.


3. Why should a server return different HTTP status codes for different situations?

Different situations call for different status codes to make the API more robust and descriptive to the actual issue. For example you would correct your submission if you reach a 400, but you would report a malfunction if you recieve a 500 error.


4. What happens if the client sends invalid JSON?

It fails to parse, and the application sends you a 400 (bad request)


5. How is this lab different from Lab 1?

Because this lab uses HTTP (a well-defined protocol) instead of raw TCP sockets

## Graduate Student Extension

Features I added for my extension:
* GET /time, returns ISO string time
* Remainder operation on the calculate endpoint