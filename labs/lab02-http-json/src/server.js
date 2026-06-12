import http from "node:http";

const DEFAULT_PORT = 3000;

let requestCount = 0;

export function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(body));
}

export function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            if (body.trim() === "") {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
}

export function handleCalculate(body) {
    // Return an error for unsupported operations.
    var types = ["add", "subtract", "multiply", "divide", "remainder"];
    if (!types.includes(body["operation"])) {
        return {
            statusCode: 400,
            response: {
                error: "Invalid operation"
            }
        };
    }

    // Validate that operation, a, and b are present.
    if (body["a"] === undefined || body["b"] === undefined) {
        return {
            statusCode: 400,
            response: {
                error: "Missing variables for a or b"
            }
        };
    }

    // Validate that a and b are numbers.
    var a = parseInt(body["a"]);
    var b = parseInt(body["b"]);
    if (isNaN(a) || isNaN(b)) {
        return {
            statusCode: 400,
            response: {
                error: "a and b must be numbers"
            }
        };
    }

    // Support add, subtract, multiply, and divide.
    if (body["operation"] === "add") {
        return {
            statusCode: 200,    
            response: {
                result: a + b
            }
        };
    }
    if (body["operation"] === "subtract") {
        return {
            statusCode: 200,    
            response: {
                result: a - b
            }
        };
    }
    if (body["operation"] === "multiply") {
        return {
            statusCode: 200,    
            response: {
                result: a * b
            }   
        };
    }
    if (body["operation"] === "divide") {
        // Return an error for division by zero.
        if (b === 0) {
            return {
                statusCode: 400,
                response: {
                    error: "Cannot divide by zero"
                }
            };
        };
        return {
            statusCode: 200,    
            response: {
                result: a / b
            }
        };
    }   
    if (body["operation"] === "remainder") {
        if (b === 0) {
            return {
                statusCode: 400,
                response: {
                    error: "Cannot divide by zero"
                }
            };
        }
        return {
            statusCode: 200,
            response: {
                result: a % b
            }
        }
    }

}

export async function requestHandler(req, res) {
    requestCount += 1;

    const method = req.method;
    const url = req.url;

    if (method === "GET" && url === "/health") {
        sendJson(res, 200, { status: "ok" });
        return;
    }

    if (method === "GET" && url === "/requests") {
        // Return the current request count as JSON.
        sendJson(res, 200, { count: requestCount });
        return;
    }

    if (method === "POST" && url === "/echo") {
        try {
            const body = await readJsonBody(req);

            // Return the parsed JSON body back to the client.
            sendJson(res, 200, { message: body["message"] });
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    if (method === "POST" && url === "/calculate") {
        try {
            const body = await readJsonBody(req);
            const result = handleCalculate(body);

            sendJson(res, result.statusCode, result.response);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }
        return;
    }

    if (method === "GET" && url ===  "/time") {
        const now = new Date();
        sendJson(res, 200, { time: now.toISOString() });
        return;
    }

    sendJson(res, 404, { error: "Not found" });
}

export function createServer() {
    return http.createServer(requestHandler);
}

export function resetState() {
    requestCount = 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const port = process.env.PORT || DEFAULT_PORT;
    const server = createServer();

    server.listen(port, () => {
        console.log(`HTTP JSON server listening on port ${port}`);
    });
}