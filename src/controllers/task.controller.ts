import { Request, Response } from "express";
import prisma from "../utils/prisma";
 import { Params } from "./projectMember.controller";
export const createTask = async (req: Request<Params>, res: Response) => {
  try {
    const assignerUserId = (req as any).user.id;
    const { projectId } = req.params;
    const { userId ,title, description } = req.body;
    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }
    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
   });

    if (!projectExists) {
       return res.status(400).json({ message: "Invalid projectId" });
   }
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: "TODO",
        projectId : projectId,
        createdBy:  assignerUserId,
        assignedTo: userId
      },
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAllTasks = async (req: Request<Params>, res: Response) => {
  try {

    const projectId = req.params.projectId;
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
      }
    });

    res.json(tasks.map((t) => t));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
interface Param {
    taskId: string;
}
export const updateTask = async (
  req: Request<Param>,
  res: Response,
) => {
  try {
    const { taskId } = req.params;
    const {  status ,priority  } = req.body;
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if(!existingTask){
      return res.status(404).json({
        message: "Task not found",
      });
    }
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status,
        priority,
      },
    });

    return res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteTask = async (
  req: Request<Param>,
  res: Response,
) => {
  try {
    const { taskId } = req.params;

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.createdBy !== (req as any).user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this task",
      });
    }
    await prisma.task.delete({
      where: { id: taskId },
    });

    return res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
interface ParamForUser {
    userId: string;
}
export const getMyTasks = async (req: Request<ParamForUser>, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: userId,
      }
    });
    res.json(tasks.map((t) => t));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};