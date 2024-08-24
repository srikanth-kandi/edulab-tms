import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Access denied, JWT required!" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const { id, role, orgId } = decoded;
    req.userId = id;
    req.userRole = role;
    req.userOrgId = orgId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function roleMiddleware(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: "Invalid Role" });
    }
    next();
  };
}
