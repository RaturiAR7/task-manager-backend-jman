import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as any;
    
    const userId = decoded.userId || decoded.id;
    if (!userId) {
       return res.status(401).json({ message: "Token payload missing user ID" });
    }
    (req as any).user = { id: userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
