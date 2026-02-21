import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const userInDb=await prisma.user.findUnique({where:{id:user.id}});

    if (!userInDb) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(userInDb.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to perform this action",
      });
    }

    next();
  };
};
