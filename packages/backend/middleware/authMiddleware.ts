import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request interface to include the `user` property
interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; isAdmin?: boolean };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers["authorization"];

  if (!token) {
    // Pass error to the next middleware (error handler)
    return next(new Error("Access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET as string) as { id: string; email: string; isAdmin?: boolean };
    req.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid token."));
  }
};

export default authMiddleware;
