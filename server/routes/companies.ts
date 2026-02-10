import { Response, Router } from "express";
import { query } from "../db/index.js";
import { authenticateToken, AuthRequest, requireUser, requireCompany, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken, requireUser);

router.post("/", async (req: AuthRequest, res: Response) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Company name is required." });
  }

  const existing = await query(
    "SELECT id FROM company_users WHERE user_id = $1 AND role = 'owner'",
    [req.user!.id]
  );

  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "You already own a company." });
  }

  const client = (await import("../db/index.js")).pool;
  const conn = await client.connect();

  try {
    await conn.query("BEGIN");

    const companyResult = await conn.query(
      "INSERT INTO companies (name) VALUES ($1) RETURNING *",
      [name.trim()]
    );
    const company = companyResult.rows[0];

    await conn.query(
      "INSERT INTO company_users (company_id, user_id, role, status) VALUES ($1, $2, 'owner', 'active')",
      [company.id, req.user!.id]
    );

    await conn.query("COMMIT");

    res.status(201).json({ company });
  } catch (error: any) {
    await conn.query("ROLLBACK");
    console.error("Error creating company:", error);
    res.status(500).json({ error: "Failed to create company." });
  } finally {
    conn.release();
  }
});

router.get("/", async (req: AuthRequest, res: Response) => {
  const result = await query(
    `SELECT c.*, cu.role
     FROM companies c
     JOIN company_users cu ON c.id = cu.company_id
     WHERE cu.user_id = $1 AND cu.status = 'active'`,
    [req.user!.id]
  );

  res.json(result.rows);
});

router.get("/:id/members", requireCompany, authorizeRoles("owner", "staff"), async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (id !== req.user!.companyId) {
    return res.status(403).json({ error: "Access denied." });
  }

  const result = await query(
    `SELECT u.id, u.email, u.name, u.avatar_url, cu.role, cu.status, cu.created_at
     FROM company_users cu
     JOIN users u ON cu.user_id = u.id
     WHERE cu.company_id = $1
     ORDER BY cu.created_at ASC`,
    [id]
  );

  res.json(result.rows);
});

export default router;
