import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import companyRoutes from "./routes/companies.js";
import inviteRoutes from "./routes/invites.js";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/companies", companyRoutes);
  app.use("/api/invites", inviteRoutes);

  app.get("/api/ping", (_req, res) => {
    res.json({ message: "pong" });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return app;
}
