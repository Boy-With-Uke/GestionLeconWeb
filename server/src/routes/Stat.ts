import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const statRoutes = new Hono().get("/", async (c) => {
  try {
    const userCount = await prisma.user.count();
    const subjectCount = await prisma.matiere.count();
    const coursCount = await prisma.lecon.count();
    const teacherCount = await prisma.user.count({
      where: {
        niveauAccess: "ENSEIGNANT",
      },
    });

    c.status(200);
    return c.json({
      result: { userCount, subjectCount, coursCount, teacherCount },
    });
  } catch (error) {
    c.status(500);
    return c.json({ error });
  }
});
