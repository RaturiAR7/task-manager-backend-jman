import { Request, Response } from "express";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error:any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

 const token = jwt.sign(
  { userId: user.id} as JwtPayload,
  process.env.JWT_SECRET!,
  { expiresIn: "1d" }
);

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};