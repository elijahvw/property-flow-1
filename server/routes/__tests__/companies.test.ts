import { describe, it, expect, vi, beforeEach } from "vitest";

const mockConnect = vi.fn();
const mockClientQuery = vi.fn();
const mockRelease = vi.fn();

vi.mock("../../db/index.js", () => ({
  query: vi.fn(),
  pool: {
    connect: () =>
      Promise.resolve({
        query: mockClientQuery,
        release: mockRelease,
      }),
  },
}));

vi.mock("../../middleware/auth.js", () => {
  const mockOwner = {
    id: "user-123",
    auth0Sub: "auth0|123",
    email: "owner@example.com",
    name: "Owner",
    companyId: "company-123",
    role: "owner",
  };

  const mockTenant = {
    id: "user-456",
    auth0Sub: "auth0|456",
    email: "tenant@example.com",
    name: "Tenant",
    companyId: "company-123",
    role: "tenant",
  };

  return {
    authenticateToken: vi.fn((req: any, _res: any, next: any) => {
      req.user = req.headers["x-test-role"] === "tenant" ? mockTenant : mockOwner;
      next();
    }),
    requireUser: vi.fn((_req: any, _res: any, next: any) => next()),
    requireCompany: vi.fn((_req: any, _res: any, next: any) => next()),
    authorizeRoles: (...roles: string[]) =>
      vi.fn((req: any, res: any, next: any) => {
        if (!req.user?.role || !roles.includes(req.user.role)) {
          return res.status(403).json({ error: "Forbidden: insufficient permissions." });
        }
        next();
      }),
  };
});

import express from "express";
import request from "supertest";
import { query } from "../../db/index.js";
import companyRoutes from "../companies.js";

const mockedQuery = vi.mocked(query);

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/companies", companyRoutes);
  return app;
}

describe("Company Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/companies", () => {
    it("creates a company when user has no existing ownership", async () => {
      mockedQuery.mockResolvedValueOnce({ rows: [] } as any);

      mockClientQuery
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({
          rows: [{ id: "new-company-id", name: "My Company" }],
        } as any)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      const app = createApp();
      const res = await request(app)
        .post("/api/companies")
        .send({ name: "My Company" });

      expect(res.status).toBe(201);
      expect(res.body.company.name).toBe("My Company");
    });

    it("rejects if user already owns a company", async () => {
      mockedQuery.mockResolvedValueOnce({
        rows: [{ id: "existing" }],
      } as any);

      const app = createApp();
      const res = await request(app)
        .post("/api/companies")
        .send({ name: "Another Company" });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain("already own");
    });

    it("rejects empty company name", async () => {
      const app = createApp();
      const res = await request(app)
        .post("/api/companies")
        .send({ name: "" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/companies/:id/members", () => {
    it("returns members for owner", async () => {
      mockedQuery.mockResolvedValueOnce({
        rows: [
          { id: "user-123", email: "owner@example.com", name: "Owner", role: "owner", status: "active" },
        ],
      } as any);

      const app = createApp();
      const res = await request(app).get("/api/companies/company-123/members");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it("denies access to members of different company", async () => {
      const app = createApp();
      const res = await request(app).get("/api/companies/other-company/members");

      expect(res.status).toBe(403);
    });

    it("denies tenant from accessing members", async () => {
      const app = createApp();
      const res = await request(app)
        .get("/api/companies/company-123/members")
        .set("x-test-role", "tenant");

      expect(res.status).toBe(403);
    });
  });
});
