import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { number, z } from "zod";

const prisma = new PrismaClient();

const classSchema = z.object({
  id_classe: number(),
  nomClasse: z.string(),
});

const postClassSchema = classSchema.omit({ id_classe: true });

export const classesRoutes = new Hono()
  .get("/", async (c) => {
    const classes = await prisma.classe.findMany({
      select: {
        id_classe: true,
        nomClasse: true,
        classeMatiere: {
          select: {
            matieres: {
              select: {
                id_matiere: true,
                nom: true,
                description: true,
                enseignant: {
                  select: {
                    id_user: true,
                    nom: true,
                    prenom: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return c.json({ classes });
  })
  .get("/:id{[0-9]+}", async (c) => {
    const userId = Number.parseInt(c.req.param("id"));
    try {
      const user = await prisma.user.findFirst({
        where: {
          id_user: userId,
        },
        select: {
          id_user: true,
          nom: true,
          prenom: true,
          email: true,
          niveauAccess: true,
        },
      });
      c.status(200);
      return c.json({ user });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })
  .post("/", zValidator("json", postClassSchema), async (c) => {
    const body = await c.req.valid("json");

    try {
      // Vérifier si la classe existe déjà
      const existingClasse = await prisma.classe.findUnique({
        where: {
          nomClasse: body.nomClasse,
        },
      });

      if (existingClasse) {
        // Si l'email existe, renvoyer un statut 402 avec un message d'erreur
        c.status(401);
        return c.json({
          message: "Classe deja existante",
        });
      }

      // Créer un nouvel utilisateur
      const newClasse = await prisma.classe.create({
        data: {
          nomClasse: body.nomClasse,
        },
      });

      let message = "Nouvelle classe créé avec succès";
      c.status(200);
      return c.json({ message, newClasse });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  });
