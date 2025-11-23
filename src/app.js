// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import donacionRoutes from "./routes/donacionRoutes.js";
import postulacionRoutes from "./routes/postulacionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/donaciones", donacionRoutes);
app.use("/api/postulaciones", postulacionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    try {
      await sequelize.authenticate();
      console.log("✅ Conectado a Neon PostgreSQL");
      console.log(`🚀 Server running on port ${PORT}`);
    } catch (err) {
      console.error("❌ DB connection error:", err);
    }
  });
}

export default app;
