import { Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db";
import crypto from "crypto";
import { authenticateToken, AuthRequest, authorizeRoles } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ADMIN ONLY: Invite Landlord
export const inviteLandlord = async (req: AuthRequest, res: Response) => {
  const { name, email, companyName } = req.body;

  try {
    const registrationToken = crypto.randomUUID();
    
    // 1. Create company
    const companyRes = await query(
      "INSERT INTO companies (name) VALUES ($1) RETURNING id",
      [companyName || `${name}'s Company`]
    );
    const companyId = companyRes.rows[0].id;

    // 2. Create user as 'invited'
    await query(
      "INSERT INTO users (name, email, role, company_id, status, registration_token) VALUES ($1, $2, $3, $4, $5, $6)",
      [name, email, "landlord", companyId, "invited", registrationToken]
    );

    // TODO: Send email with link: /complete-registration?token=${registrationToken}
    console.log(`INVITE SENT to ${email}: /complete-registration?token=${registrationToken}`);

    res.status(201).json({ message: "Invitation sent", token: registrationToken });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// LANDLORD ONLY: Invite Tenant
export const inviteTenant = async (req: AuthRequest, res: Response) => {
  const { name, email, propertyId } = req.body;
  const companyId = req.user?.companyId;

  try {
    const registrationToken = crypto.randomUUID();
    
    // Verify landlord owns the property
    const propertyRes = await query("SELECT company_id FROM properties WHERE id = $1 AND company_id = $2", [propertyId, companyId]);
    if (propertyRes.rows.length === 0) {
      return res.status(404).json({ error: "Property not found or access denied" });
    }

    // Create user as 'invited'
    await query(
      "INSERT INTO users (name, email, role, company_id, status, registration_token) VALUES ($1, $2, $3, $4, $5, $6)",
      [name, email, "tenant", companyId, "invited", registrationToken]
    );

    // TODO: Send email with link: /complete-registration?token=${registrationToken}
    console.log(`TENANT INVITE SENT to ${email}: /complete-registration?token=${registrationToken}`);

    res.status(201).json({ message: "Invitation sent", token: registrationToken });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// USER: Complete Registration (Set Password)
export const completeRegistration = async (req: AuthRequest, res: Response) => {
  const { token, password } = req.body;

  try {
    const userRes = await query(
      "SELECT id FROM users WHERE registration_token = $1 AND status = 'invited'",
      [token]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const userId = userRes.rows[0].id;
    const passwordHash = await bcrypt.hash(password, 10);

    await query(
      "UPDATE users SET password_hash = $1, status = 'active', registration_token = NULL WHERE id = $2",
      [passwordHash, userId]
    );

    res.json({ message: "Registration complete. You can now log in." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleLogin = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    const userRes = await query("SELECT * FROM users WHERE email = $1 AND status = 'active'", [email]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials or account not activated" });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role, companyId: user.company_id }, JWT_SECRET);
    delete user.password_hash;

    res.json({ user, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

router.post("/invite-landlord", authenticateToken, authorizeRoles("admin"), inviteLandlord);
router.post("/invite-tenant", authenticateToken, authorizeRoles("landlord"), inviteTenant);
router.post("/complete-registration", completeRegistration);
router.post("/login", handleLogin);

export default router;
