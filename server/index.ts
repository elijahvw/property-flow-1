import "dotenv/config";
import express from "express";
import cors from "cors";
import { initDb } from "./db";
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/properties";
import tenantRoutes from "./routes/tenants";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize DB route (for convenience in MVP)
  app.post("/api/init-db", async (_req, res) => {
    try {
      await initDb();
      res.json({ message: "Database initialized successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/properties", propertyRoutes);
  app.use("/api/tenants", tenantRoutes);

  app.get("/api/ping", (_req, res) => {
    res.json({ message: "pong" });
  });

  return app;
}
