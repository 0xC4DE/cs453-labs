import { describe, test, expect, beforeEach, afterEach } from "vitest";

let baseUrl = "http://localhost:3000";

async function getJson(path) {
    const response = await fetch(`${baseUrl}${path}`);
    const body = await response.json();

    return {
        status: response.status,
        body
    };
}

async function reqJson(path, method, data) {
    const response = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    const body = await response.json();

    return {
        status: response.status,
        body
    };
}

async function postRaw(path, rawBody) {
    const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: rawBody
    });

    const body = await response.json();

    return {
        status: response.status,
        body
    };
}

describe("Lab 3 HTTP RESTful server", () => {
    test("GET /health returns status ok", async () => {
        const result = await getJson("/health");

        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            status: "ok"
        });
    });

    test("unknown route returns 404", async () => {
        const result = await getJson("/missing");

        expect(result.status).toBe(404);
        expect(result.body).toHaveProperty("error");
    });

    test("GET /items returns nothing", async () => {
        const result = await getJson("/items", {});

        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            status: "ok",
            items: [],
        });
    });

    test("POST /items inserts the item", async () => {
        const result = await reqJson("/items", "POST", {
            "name": "puter",
            "quantity": 10,
        });

        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            status: "ok",
            item: {
                id: 1,
                name: "puter",
                quantity: 10,
            }
        })
    });

    test("GET /items now shows the new item", async () => {
        const result = await getJson("/items", {});

        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            status: "ok",
            items: [
                {
                    id: 1,
                    name: "puter",
                    quantity: 10,
                }
            ]
        })
    });

    test("GET /items/:id retrieves the item", async () => {
        const result = await getJson("/items/1", {});

        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            status: "ok",
            item: {
                id: 1,
                name: "puter",
                quantity: 10,
            }
        })
    });

    test("PUT /items/:id updates the item", async () => {
        const result = await reqJson("/items/1", "PUT", {
            quantity: 100,
        })

        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            status: "ok",
            item: {
                id: 1,
                name: "puter",
                quantity: 100,
            }
        })
    });

    test("DELETE /items/:id deletes the item", async () => {
        const result = await reqJson("/items/1", "DELETE", {})

        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            status: "ok",
            item: {
                id: 1,
                name: "puter",
                quantity: 100,
            }
        })
    });

    test("GET /items now shows no items", async () => {
        const result = await getJson("/items", {});

        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            status: "ok",
            items: []
        })
    });
});
