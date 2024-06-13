import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { number, z } from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
  id_user: number(),
  nom: z.string(),
  prenom: z.string(),
  email: z.string(),
  motDePasse: z.string(),
});

const postUserSchema = userSchema.omit({ id_user: true });

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
  .post("/", zValidator("json", postUserSchema), async (c) => {
    const body = await c.req.valid("json");

    try {
      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (existingUser) {
        // Si l'email existe, renvoyer un statut 402 avec un message d'erreur
        c.status(401);
        return c.json({
          message: "L'email est deja liee a un compte",
        });
      }

      // Créer un nouvel utilisateur
      const newUser = await prisma.user.create({
        data: {
          nom: body.nom,
          prenom: body.prenom,
          email: body.email,
          motDePasse: body.motDePasse,
        },
      });

      let message = "Nouvel utilisateur créé avec succès";
      c.status(200);
      return c.json({ message, newUser });
    } catch (error) {
      c.status(500);
      return c.json({ error: error.message });
    }
  });

