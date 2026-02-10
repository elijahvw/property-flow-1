import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../db/index.js", () => ({
  query: vi.fn(),
  pool: { connect: vi.fn() },
}));

vi.mock("../../middleware/auth.js", () => {
  const mockUser = {
    id: "user-123",
    auth0Sub: "auth0|123",
    email: "test@example.com",
    name: "Test User",
    companyId: "company-123",
    role: "owner",
  };

  return {
    authenticateToken: vi.fn((req: any, _res: any, next: any) => {
      req.user = mockUser;
      next();
    }),
    requireUser: vi.fn((_req: any, _res: any, next: any) => next()),
    requireCompany: vi.fn((_req: any, _res: any, next: any) => next()),
    authorizeRoles: (...roles: string[]) =>
      vi.fn((req: any, res: any, next: any) => {
        if (!req.user?.role || !roles.includes(req.user.role)) {
          return res.status(403).json({ error: "Forbidden" });
        }
        next();
      }),
  };
});

import express from "express";
import request from "supertest";
import { query } from "../../db/index.js";
import authRoutes from "../auth.js";

const mockedQuery = vi.mocked(query);

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  return app;
}

describe("Auth Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/auth/me", () => {
    it("returns user profile with memberships", async () => {
      mockedQuery.mockResolvedValueOnce({
        rows: [
          {
            role: "owner",
            status: "active",
            company_id: "company-123",
            company_name: "Test Company",
          },
        ],
      } as any);

      const app = createApp();
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body.memberships).toHaveLength(1);
      expect(res.body.memberships[0].role).toBe("owner");
    });
  });
});
