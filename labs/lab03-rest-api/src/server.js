import express from "express";

const PORT = process.env.PORT || 3000;

const app = express();

function findItemByID(id) {
    const numericId = parseInt(id, 10);
    const idx = globalItems.findIndex((element) => element.id === numericId);
    if (idx === -1) {
        return { element: null, idx: -1 };
    }
    return { element: globalItems[idx], idx };
}

// This middleware tells Express to parse JSON request bodies.
app.use(express.json());

let requestCount = 0;


// Simple middleware that runs before each route.
app.use((req, res, next) => {
    requestCount += 1;
    console.log(`${req.method} ${req.path}`);
    next();
});

// All Items, a big issue with this is concurrency
// It would require some type of lock on global items if this webserver were to serve
// multiple hosts or even expect concurrent appends/deletes.
const globalItems = [];
let nextId = 1;

// Routes
app.get("/health", (req, res) => {
    return res.json({
        status: "ok"
    });
});

app.get("/items", (req, res) => {
    return res.json({
        status: "ok",
        items: globalItems,
    });
})

app.get("/items/:id", (req, res) => {
    const {id} = req.params;
    if (isNaN(parseInt(id, 10))) {
        return res.status(400).json({ 
            status: "failure",
            error: "id was not a number",
        })
    }
    const { element } = findItemByID(id);
    if (element != null) {
        return res.json({
            status: "ok",
            item: element,
        });
    } else {
        return res.status(404).json({ 
            status: "failure",
            error: "item not found",
        });
    }
})

app.post("/items", (req, res) => {
    const body = req.body;
    if (body.name == null){
        return res.status(400).json({
            status: "failure",
            error: "Name must be in body",
        })
    }
    if (body.quantity == null || isNaN(parseInt(body.quantity) || parseInt(body.quantity) < 0)) {
        return res.status(400).json({
            status: "failure",
            error: "Quantity must be in body and a valid number",
        })
    }

    let item = {
        "id": nextId++,
        "name": body.name,
        "quantity": parseInt(body.quantity),
    }

    globalItems.push(item)

    return res.json({
        status: "ok",
        item: item
    })
})

app.put("/items/:id", (req, res) => {
    const {id} = req.params;
    if (isNaN(parseInt(id, 10))) {
        return res.status(400).json({
            status: "failure",
            error: "ID is not valid",
        })
    }
    const { element, idx } = findItemByID(id);
    if (element == null) {
        return res.status(404).json({ 
            status: "failure",
            error: "ID not found",
        });
    }
    const body = req.body;

    if (body.quantity != null && isNaN(parseInt(body.quantity, 10))) {
        return res.status(400).json({
            status: "failure",
            error: "Quantity is not a number",
        })
    }

    if (body.quantity != null) {
        globalItems[idx].quantity = parseInt(body.quantity, 10);
    }
    if (body.name != null) {
        globalItems[idx].name = body.name;
    }

    return res.json({ 
        status: "ok",
        item: globalItems[idx],
    })
})

app.delete("/items/:id", (req, res) => {
    const {id} = req.params;
    if (isNaN(parseInt(id, 10))) {
        return res.status(400).json({
            status: "failure",
            error: "ID is not valid",
        })
    }
    const { element, idx } = findItemByID(id);
    if (element == null) {
        return res.status(404).json({ 
            status: "failure",
            error: "ID not found",
        });
    }
    globalItems.splice(idx, 1);
    return res.json({
        status: "ok",
        item: element,
    });
})

// This catches requests that did not match any route above.
app.use((req, res) => {
    res.status(404).json({
        error: "Not found"
    });
});


const server = app.listen(PORT, () => {
  console.log(`Express routes example listening on port ${PORT}`);
});

server.on("error", error => {
  console.error("Unable to start server:", error.message);
});
