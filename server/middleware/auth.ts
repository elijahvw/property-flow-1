import { Request, Response, NextFunction } from "express";
import jwksRsa from "jwks-rsa";
import jwt from "jsonwebtoken";
import { query } from "../db/index.js";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "";
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "";

const jwksClient = jwksRsa({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export interface AuthUser {
  id: string;
  auth0Sub: string;
  email: string;
  name: string;
  companyId?: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(
    token,
    getKey,
    {
      audience: AUTH0_AUDIENCE,
      issuer: `https://${AUTH0_DOMAIN}/`,
      algorithms: ["RS256"],
    },
    async (err, decoded: any) => {
      if (err) {
        console.error("Token verification failed:", err.message);
        return res.status(401).json({ error: "Invalid or expired token." });
      }

      try {
        const auth0Sub = decoded.sub;
        const userResult = await query(
          "SELECT u.id, u.auth0_sub, u.email, u.name FROM users u WHERE u.auth0_sub = $1",
          [auth0Sub]
        );

        if (userResult.rows.length === 0) {
          (req as any).auth0Sub = auth0Sub;
          (req as any).auth0Email = decoded.email || decoded[`https://${AUTH0_DOMAIN}/email`] || "";
          (req as any).auth0Name = decoded.name || decoded[`https://${AUTH0_DOMAIN}/name`] || "";
          return next();
        }

        const user = userResult.rows[0];
        req.user = {
          id: user.id,
          auth0Sub: user.auth0_sub,
          email: user.email,
          name: user.name,
        };

        const membershipResult = await query(
          "SELECT company_id, role FROM company_users WHERE user_id = $1 AND status = 'active' LIMIT 1",
          [user.id]
        );

        if (membershipResult.rows.length > 0) {
          req.user.companyId = membershipResult.rows[0].company_id;
          req.user.role = membershipResult.rows[0].role;
        }

        next();
      } catch (dbErr) {
        console.error("Auth middleware DB error:", dbErr);
        return res.status(500).json({ error: "Internal server error during auth." });
      }
    }
  );
};

export const requireUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.id) {
    return res.status(403).json({ error: "User profile not found. Please complete registration." });
  }
  next();
};

export const requireCompany = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.companyId) {
    return res.status(403).json({ error: "No company membership found." });
  }
  next();
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions." });
    }
    next();
  };
};
