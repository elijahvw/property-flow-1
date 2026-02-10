import { Response, Router } from "express";
import { query } from "../db/index.js";
import { authenticateToken, AuthRequest, requireUser, requireCompany, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticateToken, requireUser, requireCompany, authorizeRoles("owner"), async (req: AuthRequest, res: Response) => {
  const { email, role } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required." });
  }

  if (!role || !["staff", "tenant"].includes(role)) {
    return res.status(400).json({ error: "Role must be 'staff' or 'tenant'." });
  }

  const existing = await query(
    "SELECT id FROM invites WHERE company_id = $1 AND email = $2 AND status = 'pending'",
    [req.user!.companyId, email.toLowerCase()]
  );

  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "An active invite already exists for this email." });
  }

  const alreadyMember = await query(
    `SELECT cu.id FROM company_users cu
     JOIN users u ON cu.user_id = u.id
     WHERE cu.company_id = $1 AND u.email = $2 AND cu.status = 'active'`,
    [req.user!.companyId, email.toLowerCase()]
  );

  if (alreadyMember.rows.length > 0) {
    return res.status(409).json({ error: "This user is already a member of your company." });
  }

  try {
    const result = await query(
      `INSERT INTO invites (company_id, email, role, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user!.companyId, email.toLowerCase(), role, req.user!.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating invite:", error);
    res.status(500).json({ error: "Failed to create invite." });
  }
});

router.get("/", authenticateToken, requireUser, requireCompany, authorizeRoles("owner", "staff"), async (req: AuthRequest, res: Response) => {
  const result = await query(
    `SELECT i.*, u.name as created_by_name
     FROM invites i
     JOIN users u ON i.created_by = u.id
     WHERE i.company_id = $1
     ORDER BY i.created_at DESC`,
    [req.user!.companyId]
  );

  res.json(result.rows);
});

router.post("/:token/accept", authenticateToken, requireUser, async (req: AuthRequest, res: Response) => {
  const { token } = req.params;

  const inviteResult = await query(
    "SELECT * FROM invites WHERE token = $1 AND status = 'pending' AND expires_at > NOW()",
    [token]
  );

  if (inviteResult.rows.length === 0) {
    return res.status(404).json({ error: "Invite not found, expired, or already used." });
  }

  const invite = inviteResult.rows[0];

  if (invite.email !== req.user!.email) {
    return res.status(403).json({ error: "This invite was sent to a different email address." });
  }

  const client = (await import("../db/index.js")).pool;
  const conn = await client.connect();

  try {
    await conn.query("BEGIN");

    await conn.query(
      "INSERT INTO company_users (company_id, user_id, role, status) VALUES ($1, $2, $3, 'active') ON CONFLICT (company_id, user_id) DO UPDATE SET role = $3, status = 'active'",
      [invite.company_id, req.user!.id, invite.role]
    );

    await conn.query(
      "UPDATE invites SET status = 'accepted' WHERE id = $1",
      [invite.id]
    );

    await conn.query("COMMIT");

    res.json({ message: "Invite accepted successfully." });
  } catch (error: any) {
    await conn.query("ROLLBACK");
    console.error("Error accepting invite:", error);
    res.status(500).json({ error: "Failed to accept invite." });
  } finally {
    conn.release();
  }
});

router.delete("/:id", authenticateToken, requireUser, requireCompany, authorizeRoles("owner"), async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    "UPDATE invites SET status = 'revoked' WHERE id = $1 AND company_id = $2 AND status = 'pending' RETURNING *",
    [id, req.user!.companyId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Invite not found." });
  }

  res.json({ message: "Invite revoked." });
});

export default router;
