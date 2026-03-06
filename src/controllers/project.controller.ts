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

interface Params {
  projectId: string;
}

export const addProjectMember = async (req: Request<Params>, res: Response) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    if (!userId && !projectId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    // Check project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check already member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({
        message: "User is already a project member",
      });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
      },
    });

    return res.status(201).json({
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
