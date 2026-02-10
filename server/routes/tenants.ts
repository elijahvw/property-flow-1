import { Response, Router } from "express";
import { query } from "../db";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Apply auth middleware to all tenant routes
router.use(authenticateToken);

// GET /api/tenants - Get all tenants for the landlord's company
export const getTenants = async (req: AuthRequest, res: Response) => {
  const companyId = req.user?.companyId;

  try {
    const result = await query(
      `SELECT t.*, p.name as property_name 
       FROM tenants t 
       JOIN properties p ON t.property_id = p.id 
       WHERE t.company_id = $1`,
      [companyId]
    );
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/tenants - Create a new tenant record
export const createTenant = async (req: AuthRequest, res: Response) => {
  const companyId = req.user?.companyId;
  const { name, email, phone, propertyId, leaseEndDate } = req.body;

  try {
    // Double check that the property belongs to the company
    const propCheck = await query(
      "SELECT id FROM properties WHERE id = $1 AND company_id = $2",
      [propertyId, companyId]
    );

    if (propCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized: Property does not belong to your company" });
    }

    const result = await query(
      `INSERT INTO tenants (company_id, name, email, phone, property_id, lease_end_date, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') 
       RETURNING *`,
      [companyId, name, email, phone, propertyId, leaseEndDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

router.get("/", getTenants);
router.post("/", createTenant);

export default router;
