import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const userRoutes = new Hono()
  .get("/", async (c) => {
    const users = await prisma.user.findMany({
      select: {
        id_user: true,
        nom: true,
        prenom: true,
        email: true,
        motDePasse: true,
        niveauAccess: true,
        coursUtilisateur: true,
      },
    });

    return c.json({ users });
  })
  .post("/", async (c) => {});
