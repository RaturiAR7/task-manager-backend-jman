import { PrismaClient } from "../generated/prisma/client";

const PrismaClientClass = PrismaClient as unknown as { new (opts?: any): any };

const prisma = new PrismaClientClass();

export default prisma;
