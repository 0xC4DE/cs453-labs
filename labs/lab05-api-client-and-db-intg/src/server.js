import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 5433),
  database: process.env.PGDATABASE ?? "lab05",
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "postgres"
});

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ]
  }));

  app.get("/health", async (req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "error",
        message: "Database connection failed."
      });
    }
  });

  // Starter route: return every item from the database.
  app.get("/api/items", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT items.id, items.name, items.quantity,
          CASE WHEN item_type.id IS NOT NULL
            THEN json_build_object('id', item_type.id, 'name', item_type.name)
            ELSE NULL
          END AS type
        FROM items
        LEFT JOIN item_type ON items.type = item_type.id
        ORDER BY items.id ASC
      `);

      res.json({ items: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  });

  // Starter route: create one item so the client can demonstrate a write.
  app.post("/api/items", async (req, res) => {
    const name = req.body?.name?.trim();
    const quantity = Number(req.body?.quantity);

    if (!name || !Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name and non-negative integer quantity are required."
      });
    }

    // Graduate Extension: Check if type is provided and use it if it is.
    const type = req.body?.type.trim();
    if (type && typeof type !== "string") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Type must be a string."
      });
    }

    let typeId;
    if (type) {
      const typeResult = await pool.query(
        `
          SELECT id FROM item_type
          WHERE name = $1
        `, [type]
      );
      if (typeResult.rows.length === 0) {
        return res.status(400).json({
          error: "Bad Request",
          message: `Type '${type}' does not exist.`
        });
      }
      typeId = typeResult.rows[0].id;
    }

    try {
      let result;
      if (!type) {
        result = await pool.query(
          `
            INSERT INTO items (name, quantity)
            VALUES ($1, $2)
            RETURNING id, name, quantity
          `,
          [name, quantity]
        );
      } else {
        result = await pool.query(
          `
            INSERT INTO items (name, quantity, type)
            VALUES ($1, $2, $3)
            RETURNING id, name, quantity, type
          `,
          [name, quantity, typeId]
        );
      }

      res.status(201).json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to add item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to add item."
      });
    }
  });

  // Return one item by ID.
  app.get("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "ID must be a positive integer."
      });
    }

    try {
      const result = await pool.query(
        `
          SELECT items.id, items.name, items.quantity,
            CASE WHEN item_type.id IS NOT NULL
              THEN json_build_object('id', item_type.id, 'name', item_type.name)
              ELSE NULL
            END AS type
          FROM items
          LEFT JOIN item_type ON items.type = item_type.id
          WHERE items.id = $1
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: `Item with ID ${id} not found.`
        });
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to load item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load item."
      });
    }
  });

  app.put("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "ID must be a positive integer."
      });
    }

    const name = req.body?.name?.trim();
    const quantity = Number(req.body?.quantity);
    const type = req.body?.type.trim();

    if (!name || !Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name and non-negative integer quantity are required."
      });
    }

    if (type && typeof type !== "string") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Type must be a string."
      });
    }

    try {
      let typeId;
      if (type) {
        const typeResult = await pool.query(
          `
            SELECT id FROM item_type
            WHERE name = $1
          `,
          [type]
        );

        if (typeResult.rows.length === 0) {
          return res.status(400).json({
            error: "Bad Request",
            message: `Type '${type}' does not exist.`
          });
        }

        typeId = typeResult.rows[0].id;
      }

      let result;
      if (!type) {
        result = await pool.query(
          `
            UPDATE items
            SET name = $1, quantity = $2
            WHERE id = $3
            RETURNING id, name, quantity
          `,
          [name, quantity, id]
        );
      } else {
        result = await pool.query(
          `
            UPDATE items
            SET name = $1, quantity = $2, type = $3
            WHERE id = $4
            RETURNING id, name, quantity, type
          `,
          [name, quantity, typeId, id]
        );
      }

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: `Item with ID ${id} not found.`
        });
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to update item:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to replace item."
      });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "ID must be a positive integer."
      });
    }

    const name = req.body?.name?.trim();
    const quantity = Number(req.body?.quantity);
    const type = req.body?.type?.trim();

    if (name && typeof name !== "string") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Name must be a string."
      });
    } else if (name) {
      await pool.query(
        `
          UPDATE items
          SET name = $1
          WHERE id = $2
        `,
        [name, id]
      );
    }

    if (req.body?.quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Quantity must be a non-negative integer."
      });
    } else if (req.body?.quantity !== undefined) {
      await pool.query(
        `
          UPDATE items
          SET quantity = $1
          WHERE id = $2
        `,
        [quantity, id]
      );
    }


    if (type && typeof type !== "string") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Type must be a string."
      });
    } else if (type) {
      await pool.query(
        `
          SELECT id FROM item_type
          WHERE name = $1
        `, [type]
      );
    }

    res.status(204).send();
  });

  app.delete("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "ID must be a positive integer."
      });
    }

    try {
      const result = await pool.query(
        `
          DELETE FROM items
          WHERE id = $1
          RETURNING id
        `,
        [id]
      );

      if (result.rows.length === 1) {
        res.status(204).send();
      } else {
        res.status(404).json({
          error: "Not Found",
          message: `Item with ID ${id} not found.`
        });
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to delete item."
      });
    }
  });

  app.get("/api/types", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, name
        FROM item_type
        ORDER BY id ASC
      `);

      res.json({ types: result.rows });
    } catch (error) {
      console.error("Failed to load types:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load types."
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS item_type (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity >= 0),
      type INTEGER REFERENCES item_type(id)
    )
  `);

  const { rows: typeRows } = await pool.query("SELECT COUNT(*)::int AS count FROM item_type");

  if (typeRows[0].count === 0) {
    await pool.query(
      `
        INSERT INTO item_type (name)
        VALUES ($1), ($2), ($3)
      `,
      ["Electronics", "Furniture", "Stationery"]
    );
  }


  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM items");

  if (rows[0].count === 0) {
    await pool.query(
      `
        INSERT INTO items (name, quantity)
        VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)
      `,
      ["Keyboard", 10, 1, "Mouse", 5, 2, "Monitor", 3, 3]
    );
  }

}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const app = createApp();

  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Lab 5 API listening on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error);
      process.exit(1);
    });
}