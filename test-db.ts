import prisma from "./src/utils/prisma";

async function run() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No users found");
      return;
    }
    console.log("Found user:", user.id);
    
    console.log("Testing projectMember.findMany...");
    const projects = await prisma.projectMember.findMany({
      where: { userId: user.id },
      include: { project: true },
    });
    console.log("Success! Projects:", projects.length);

    console.log("Testing task.findMany...");
    const tasks = await prisma.task.findMany({
      where: { assignedTo: user.id }
    });
    console.log("Success! Tasks:", tasks.length);

  } catch (err) {
    console.error("PRISMA ERROR:");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
