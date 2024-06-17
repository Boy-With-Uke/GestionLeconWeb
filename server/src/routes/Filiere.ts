import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { number, z } from "zod";

const prisma = new PrismaClient();

const filiereSchema = z.object({
  id_filiere: number(),
  nomFiliere: z.string(),
});

const postFiliereSchema = filiereSchema.omit({ id_filiere: true });

export const filieresRoutes = new Hono()
  .get("/", async (c) => {
    const filieres = await prisma.filiere.findMany({
      select: {
        id_filiere: true,
        nomFiliere: true,
        classes: {
          select: {
            nomClasse: true,
          },
        },
      },
    });
    c.status(200);
    return c.json({ filieres });
  })
  .get("/names", async (c) => {
    const filieres = await prisma.filiere.findMany({
      select: {
        id_filiere: true,
        nomFiliere: true,
      },
    });
    c.status(200);
    return c.json({ filieres });
  })
  .get("/:id{[0-9]+}", async (c) => {
    const filiereId = Number.parseInt(c.req.param("id"));
    try {
      const filiere = await prisma.filiere.findFirst({
        where: {
          id_filiere: filiereId,
        },
        select: {
          id_filiere: true,
          nomFiliere: true,
          classes: {
            select: {
              nomClasse: true,
            },
          },
        },
      });
      c.status(200);
      return c.json({ filiere });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })

  .post("/", zValidator("json", postFiliereSchema), async (c) => {
    const body = await c.req.valid("json");

    try {
      // Vérifier si la classe existe déjà
      const existingFiliere = await prisma.filiere.findUnique({
        where: {
          nomFiliere: body.nomFiliere,
        },
      });

      if (existingFiliere) {
        // Si l'email existe, renvoyer un statut 402 avec un message d'erreur
        c.status(401);
        return c.json({
          message: "Filiere deja existante",
        });
      }

      // Créer un nouvel utilisateur
      const newFiliere = await prisma.filiere.create({
        data: {
          nomFiliere: body.nomFiliere,
        },
      });

      let message = "Nouvelle filiere créé avec succès";
      c.status(200);
      return c.json({ message, newFiliere });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const filiereId = Number.parseInt(c.req.param("id"));

    try {
      const existingFiliere = await prisma.filiere.findFirst({
        where: {
          id_filiere: filiereId,
        },
      });

      let message;

      if (!existingFiliere) {
        message = `La filiere avec l\'id: ${filiereId} n'existe pas`;
        c.status(404);
        return c.json({ message });
      } else {
        const deletedFiliere = await prisma.filiere.delete({
          where: {
            id_filiere: filiereId,
          },
        });
        message = `La filiere avec l\'id: ${filiereId} a été supprimé avec succès`;
        c.status(200);
        return c.json({ message, deletedFiliere });
      }
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })
  .put("/:id{[0-9]+}", zValidator("json", postFiliereSchema), async (c) => {
    const filiereId = Number.parseInt(c.req.param("id"));
    const body = await c.req.valid("json");
    try {
      const existingFiliere = await prisma.filiere.findFirst({
        where: {
          id_filiere: filiereId,
        },
      });

      let message;

      if (!existingFiliere) {
        message = `La filiere avec l\'id: ${filiereId} n'existe pas`;
        c.status(404);
        return c.json({ message });
      } else {
        const updatedFiliere = await prisma.filiere.update({
          where: {
            id_filiere: filiereId,
          },
          data: {
            nomFiliere: body.nomFiliere,
          },
        });
        message = `La filiere avec l\'id: ${filiereId} a été modifie avec succès`;
        c.status(200);
        return c.json({ message, updatedFiliere });
      }
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  });
