import { Request, Response } from "express";
import prisma from "../utils/prisma";

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

interface RemoveMemberParams {
  projectId: string;
  userId: string;
}

export const removeProjectMember = async (
  req: Request<RemoveMemberParams>,
  res: Response,
) => {
  try {
    const { projectId, userId } = req.params;

    // Check project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Prevent removing creator
    if (project.createdBy === userId) {
      return res.status(400).json({
        message: "Project creator cannot be removed",
      });
    }

    // Check membership
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "User is not a project member",
      });
    }

    // Delete member
    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    return res.json({
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
