import { Response, Router } from "express";
import { query } from "../db";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

export const getProperties = async (req: AuthRequest, res: Response) => {
  const companyId = req.user?.companyId;
  if (!companyId) return res.status(400).json({ error: "Missing company ID" });

  try {
    const result = await query("SELECT * FROM properties WHERE company_id = $1", [companyId]);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  const companyId = req.user?.companyId;
  const { name, address, type, units, monthly_rent, status } = req.body;

  try {
    const result = await query(
      "INSERT INTO properties (company_id, name, address, type, units, monthly_rent, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [companyId, name, address, type, units, monthly_rent, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

router.use(authenticateToken);
router.get("/", getProperties);
router.post("/", createProperty);

export default router;
