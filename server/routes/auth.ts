import { Response, Router } from "express";
import { query } from "../db/index.js";
import { authenticateToken, AuthRequest, requireUser } from "../middleware/auth.js";

const router = Router();

router.post("/me", authenticateToken, async (req: AuthRequest, res: Response) => {
  if (req.user?.id) {
    const memberships = await query(
      `SELECT cu.role, cu.status, c.id as company_id, c.name as company_name
       FROM company_users cu
       JOIN companies c ON cu.company_id = c.id
       WHERE cu.user_id = $1 AND cu.status = 'active'`,
      [req.user.id]
    );

    return res.json({
      user: req.user,
      memberships: memberships.rows,
    });
  }

  const auth0Sub = (req as any).auth0Sub;
  const auth0Email = (req as any).auth0Email;
  const auth0Name = (req as any).auth0Name;

  if (!auth0Sub) {
    return res.status(401).json({ error: "Authentication failed." });
  }

  try {
    const result = await query(
      "INSERT INTO users (auth0_sub, email, name) VALUES ($1, $2, $3) RETURNING *",
      [auth0Sub, auth0Email, auth0Name || auth0Email]
    );

    const newUser = result.rows[0];

    const pendingInvites = await query(
      "SELECT id, company_id, role FROM invites WHERE email = $1 AND status = 'pending' AND expires_at > NOW()",
      [auth0Email]
    );

    for (const invite of pendingInvites.rows) {
      await query(
        "INSERT INTO company_users (company_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (company_id, user_id) DO NOTHING",
        [invite.company_id, newUser.id, invite.role]
      );
      await query(
        "UPDATE invites SET status = 'accepted' WHERE id = $1",
        [invite.id]
      );
    }

    const memberships = await query(
      `SELECT cu.role, cu.status, c.id as company_id, c.name as company_name
       FROM company_users cu
       JOIN companies c ON cu.company_id = c.id
       WHERE cu.user_id = $1 AND cu.status = 'active'`,
      [newUser.id]
    );

    return res.json({
      user: {
        id: newUser.id,
        auth0Sub: newUser.auth0_sub,
        email: newUser.email,
        name: newUser.name,
      },
      memberships: memberships.rows,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      const existing = await query("SELECT * FROM users WHERE auth0_sub = $1", [auth0Sub]);
      if (existing.rows.length > 0) {
        return res.json({ user: existing.rows[0], memberships: [] });
      }
    }
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Failed to create user profile." });
  }
});

router.get("/me", authenticateToken, requireUser, async (req: AuthRequest, res: Response) => {
  const memberships = await query(
    `SELECT cu.role, cu.status, c.id as company_id, c.name as company_name
     FROM company_users cu
     JOIN companies c ON cu.company_id = c.id
     WHERE cu.user_id = $1`,
    [req.user!.id]
  );

  res.json({
    user: req.user,
    memberships: memberships.rows,
  });
});

export default router;
