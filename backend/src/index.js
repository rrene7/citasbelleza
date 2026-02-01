import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";
import { requireAuth } from "./auth.js";
import {
  registerSchema,
  loginSchema,
  salonSchema,
  serviceSchema,
  workerSchema,
  bookingSchema
} from "./validators.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const corsOrigin = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Auth
app.post("/api/auth/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const hash = await bcrypt.hash(data.password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, role",
      [data.email, hash, data.name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Invalid data or email already exists." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [data.email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(data.password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// Salons (public list)
app.get("/api/salons", async (_req, res) => {
  const result = await pool.query("SELECT * FROM salons ORDER BY id DESC");
  res.json(result.rows);
});

app.get("/api/salons/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM salons WHERE id = $1", [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(result.rows[0]);
});

app.post("/api/salons", requireAuth, async (req, res) => {
  try {
    const data = salonSchema.parse(req.body);
    const result = await pool.query(
      `INSERT INTO salons (owner_user_id, name, description, address, phone, image_url, open_time, close_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        req.user.id,
        data.name,
        data.description || null,
        data.address || null,
        data.phone || null,
        data.image_url || null,
        data.open_time || null,
        data.close_time || null
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put("/api/salons/:id", requireAuth, async (req, res) => {
  try {
    const data = salonSchema.parse(req.body);
    const result = await pool.query(
      `UPDATE salons SET
        name=$1, description=$2, address=$3, phone=$4, image_url=$5,
        open_time=$6, close_time=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [
        data.name,
        data.description || null,
        data.address || null,
        data.phone || null,
        data.image_url || null,
        data.open_time || null,
        data.close_time || null,
        req.params.id
      ]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete("/api/salons/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM salons WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

// Services
app.get("/api/services", async (_req, res) => {
  const result = await pool.query("SELECT * FROM salon_services ORDER BY id DESC");
  res.json(result.rows);
});

app.get("/api/services/salon/:salonId", async (req, res) => {
  const result = await pool.query("SELECT * FROM salon_services WHERE salon_id = $1", [req.params.salonId]);
  res.json(result.rows);
});

app.post("/api/services", requireAuth, async (req, res) => {
  try {
    const data = serviceSchema.parse(req.body);
    const result = await pool.query(
      `INSERT INTO salon_services (salon_id, name, description, duration_minutes, price)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        data.salon_id,
        data.name,
        data.description || null,
        data.duration_minutes || null,
        data.price
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put("/api/services/:id", requireAuth, async (req, res) => {
  try {
    const data = serviceSchema.parse(req.body);
    const result = await pool.query(
      `UPDATE salon_services SET salon_id=$1, name=$2, description=$3, duration_minutes=$4, price=$5
       WHERE id=$6 RETURNING *`,
      [
        data.salon_id,
        data.name,
        data.description || null,
        data.duration_minutes || null,
        data.price,
        req.params.id
      ]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete("/api/services/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM salon_services WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

// Workers
app.get("/api/workers", async (_req, res) => {
  const result = await pool.query("SELECT * FROM workers ORDER BY id DESC");
  res.json(result.rows);
});

app.get("/api/workers/salon/:salonId", async (req, res) => {
  const result = await pool.query("SELECT * FROM workers WHERE salon_id = $1", [req.params.salonId]);
  res.json(result.rows);
});

app.post("/api/workers", requireAuth, async (req, res) => {
  try {
    const data = workerSchema.parse(req.body);
    const result = await pool.query(
      `INSERT INTO workers (salon_id, name, specialty, image_url, rating, experience)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        data.salon_id,
        data.name,
        data.specialty || null,
        data.image_url || null,
        data.rating || null,
        data.experience || null
      ]
    );
    const worker = result.rows[0];
    if (data.availability?.length) {
      for (const day of data.availability) {
        await pool.query(
          "INSERT INTO worker_availability (worker_id, weekday) VALUES ($1,$2)",
          [worker.id, day]
        );
      }
    }
    res.status(201).json(worker);
  } catch {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put("/api/workers/:id", requireAuth, async (req, res) => {
  try {
    const data = workerSchema.parse(req.body);
    const result = await pool.query(
      `UPDATE workers SET salon_id=$1, name=$2, specialty=$3, image_url=$4, rating=$5, experience=$6
       WHERE id=$7 RETURNING *`,
      [
        data.salon_id,
        data.name,
        data.specialty || null,
        data.image_url || null,
        data.rating || null,
        data.experience || null,
        req.params.id
      ]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
    await pool.query("DELETE FROM worker_availability WHERE worker_id = $1", [req.params.id]);
    if (data.availability?.length) {
      for (const day of data.availability) {
        await pool.query(
          "INSERT INTO worker_availability (worker_id, weekday) VALUES ($1,$2)",
          [req.params.id, day]
        );
      }
    }
    res.json(result.rows[0]);
  } catch {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete("/api/workers/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM workers WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

// Worker availability
app.get("/api/workers/:id/availability", async (req, res) => {
  const result = await pool.query(
    "SELECT weekday FROM worker_availability WHERE worker_id = $1",
    [req.params.id]
  );
  res.json(result.rows.map((r) => r.weekday));
});

// Bookings
app.get("/api/bookings", requireAuth, async (_req, res) => {
  const result = await pool.query("SELECT * FROM bookings ORDER BY date DESC, time DESC");
  res.json(result.rows);
});

app.get("/api/bookings/customer/:email", async (req, res) => {
  const result = await pool.query("SELECT * FROM bookings WHERE customer_email = $1 ORDER BY date DESC", [
    req.params.email
  ]);
  res.json(result.rows);
});

app.post("/api/bookings", async (req, res) => {
  try {
    const data = bookingSchema.parse(req.body);
    const existing = await pool.query(
      `SELECT id FROM bookings
       WHERE worker_id=$1 AND date=$2 AND time=$3 AND status IN ('pending','confirmed')`,
      [data.worker_id, data.date, data.time]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Time slot not available" });
    }
    const result = await pool.query(
      `INSERT INTO bookings
       (customer_name, customer_email, customer_phone, salon_id, worker_id, service_id, date, time, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending',$9) RETURNING *`,
      [
        data.customer_name,
        data.customer_email,
        data.customer_phone || null,
        data.salon_id,
        data.worker_id,
        data.service_id,
        data.date,
        data.time,
        data.notes || null
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.put("/api/bookings/:id/status", requireAuth, async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "confirmed", "completed", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });
  const result = await pool.query("UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *", [
    status,
    req.params.id
  ]);
  if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(result.rows[0]);
});

// Availability helper
app.get("/api/availability/:workerId/:date", async (req, res) => {
  const { workerId, date } = req.params;
  const worker = await pool.query(
    `SELECT s.open_time, s.close_time FROM workers w
     JOIN salons s ON w.salon_id = s.id
     WHERE w.id = $1`,
    [workerId]
  );
  if (!worker.rows[0]) return res.status(404).json({ error: "Worker not found" });
  const openTime = worker.rows[0].open_time;
  const closeTime = worker.rows[0].close_time;

  const bookings = await pool.query(
    `SELECT time FROM bookings
     WHERE worker_id=$1 AND date=$2 AND status IN ('pending','confirmed')`,
    [workerId, date]
  );
  const occupied = new Set(bookings.rows.map((b) => b.time));

  const times = [];
  const start = openTime.split(":").map(Number);
  const end = closeTime.split(":").map(Number);
  let hour = start[0];
  let minute = start[1];
  while (hour < end[0] || (hour === end[0] && minute < end[1])) {
    const label = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    if (!occupied.has(label)) times.push(label);
    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour += 1;
    }
  }
  res.json(times);
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
