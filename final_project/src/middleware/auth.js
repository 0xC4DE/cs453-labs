import jwt from 'jsonwebtoken';
import { config } from '../config.js';

// The imports above are supplied so students can use jwt and config.jwtSecret.
export function authenticateToken(req, res, next) {
  // DONE (PART 3): Validate the Bearer JWT and set req.user before calling next().
  const auth = req.get("Authorization")

  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }
  const token = auth.slice("Bearer ".length);

  try {
    req.user = jwt.verify(token, config.jwtSecret);
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // DONE (PART 3): Authorize req.user.role against allowedRoles before calling next().
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient role." });
    }
    next();
  };
}

void jwt;
void config;
