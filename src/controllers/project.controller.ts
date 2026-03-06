import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdBy: userId,
      },
    });

    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId,
      },
    });

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const projects = await prisma.projectMember.findMany({
      where: {
        userId,
      },
      include: {
        project: true,
      },
    });

    res.json(projects.map((p) => p.project));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
