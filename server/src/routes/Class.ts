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
        userClasse: {
          select: {
            id_user: true,
            nom: true,
            prenom: true,
            niveauAccess: true,
          },
        },
      },
    });
    c.status(200)
    return c.json({ classes });
  })
  .get("/:id{[0-9]+}", async (c) => {
    const classId = Number.parseInt(c.req.param("id"));
    try {
      const classe = await prisma.classe.findFirst({
        where: {
          id_classe: classId,
        },
        select: {
          id_classe: true,
          nomClasse: true,
          classeMatiere: {
            select: {
              matieres: {
                select: {
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
          userClasse: {
            select: {
              id_user: true,
              nom: true,
              prenom: true,
              niveauAccess: true,
            },
          },
        },
      });
      c.status(200);
      return c.json({ classe });
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
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const classId = Number.parseInt(c.req.param("id"));

    try {
      const existingClasse = await prisma.classe.findFirst({
        where: {
          id_classe: classId,
        },
      });

      let message;

      if (!existingClasse) {
        message = `La classe avec l\'id: ${classId} n'existe pas`;
        c.status(404);
        return c.json({ message });
      } else {
        const deletedClasse = await prisma.classe.delete({
          where: {
            id_classe: classId,
          },
        });
        message = `La classe avec l\'id: ${classId} a été supprimé avec succès`;
        c.status(200);
        return c.json({ message, deletedClasse });
      }
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })
  .put("/:id{[0-9]+}", zValidator("json", postClassSchema), async (c) => {
    const classId = Number.parseInt(c.req.param("id"));
    const body = await c.req.valid("json");
    try {
      const existingClasse = await prisma.classe.findFirst({
        where: {
          id_classe: classId,
        },
      });

      let message;

      if (!existingClasse) {
        message = `La classe avec l\'id: ${classId} n'existe pas`;
        c.status(404);
        return c.json({ message });
      } else {
        const updatedClasse = await prisma.classe.update({
          where: {
            id_classe: classId,
          },
          data: {
            nomClasse: body.nomClasse,
          },
        });
        message = `La classe avec l\'id: ${classId} a été modifie avec succès`;
        c.status(200);
        return c.json({ message, updatedClasse });
      }
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  });
