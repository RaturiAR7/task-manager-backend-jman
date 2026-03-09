-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'UPCOMING';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
