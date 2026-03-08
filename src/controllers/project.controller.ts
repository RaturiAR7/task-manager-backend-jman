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

interface UpdateProjectParams {
  projectId: string;
}

interface UpdateProjectBody {
  name?: string;
  description?: string;
}

export const updateProject = async (
  req: Request<UpdateProjectParams, {}, UpdateProjectBody>,
  res: Response,
) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    if (existingProject.createdBy !== (req as any).user.id) {
      return res.status(403).json({
        message: "Not authorized to update this project",
      });
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
      },
    });

    return res.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

interface DeleteProjectParams {
  projectId: string;
}

export const deleteProject = async (
  req: Request<DeleteProjectParams>,
  res: Response,
) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.createdBy !== (req as any).user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this project",
      });
    }

    // Delete project
    await prisma.project.delete({
      where: { id: projectId },
    });

    return res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
