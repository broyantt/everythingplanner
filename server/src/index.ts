import express from "express";
import { pool } from "./db";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

app.get("/db-check", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  return res.json({ now: result.rows[0].now });
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT:${PORT}`);
});
