import { describe, it, expect, vi, beforeEach } from "vitest";

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
import inviteRoutes from "../invites.js";

const mockedQuery = vi.mocked(query);

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/invites", inviteRoutes);
  return app;
}

describe("Invite Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/invites", () => {
    it("creates an invite as owner", async () => {
      mockedQuery
        .mockResolvedValueOnce({ rows: [] } as any)
        .mockResolvedValueOnce({ rows: [] } as any)
        .mockResolvedValueOnce({
          rows: [{
            id: "invite-1",
            email: "newstaff@example.com",
            role: "staff",
            token: "abc-123",
            status: "pending",
          }],
        } as any);

      const app = createApp();
      const res = await request(app)
        .post("/api/invites")
        .send({ email: "newstaff@example.com", role: "staff" });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe("newstaff@example.com");
      expect(res.body.role).toBe("staff");
    });

    it("rejects invite with invalid role", async () => {
      const app = createApp();
      const res = await request(app)
        .post("/api/invites")
        .send({ email: "test@example.com", role: "admin" });

      expect(res.status).toBe(400);
    });

    it("rejects duplicate pending invite", async () => {
      mockedQuery.mockResolvedValueOnce({
        rows: [{ id: "existing-invite" }],
      } as any);

      const app = createApp();
      const res = await request(app)
        .post("/api/invites")
        .send({ email: "existing@example.com", role: "staff" });

      expect(res.status).toBe(409);
    });

    it("tenant cannot create invites", async () => {
      const app = createApp();
      const res = await request(app)
        .post("/api/invites")
        .set("x-test-role", "tenant")
        .send({ email: "test@example.com", role: "staff" });

      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/invites/:token/accept", () => {
    it("accepts a valid invite", async () => {
      mockedQuery.mockResolvedValueOnce({
        rows: [{
          id: "invite-1",
          company_id: "company-123",
          email: "owner@example.com",
          role: "staff",
        }],
      } as any);

      mockClientQuery
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      const app = createApp();
      const res = await request(app).post("/api/invites/valid-token/accept");

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("accepted");
    });

    it("rejects expired or invalid invite token", async () => {
      mockedQuery.mockResolvedValueOnce({ rows: [] } as any);

      const app = createApp();
      const res = await request(app).post("/api/invites/invalid-token/accept");

      expect(res.status).toBe(404);
    });
  });
});
