import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const prisma = new PrismaClient();

const coursSchema = z.object({
  id_cours: z.number().optional(),
  titre: z.string(),
  dateDebut: z.string(),
  dateFin: z.string(),
});

const postCoursSchema = coursSchema.extend({ id_matiere: z.number() });
const updateCoursSchema = coursSchema.omit({ id_cours: true });

export const coursesRoutes = new Hono()
  .get("/", async (c) => {
    const courses = await prisma.cours.findMany({
      select: {
        id_cours: true,
        titre: true,
        dateDebut: true,
        dateFin: true,
        courMatiere: {
          select: {
            nom: true,
            enseignant: {
              select: {
                nom: true,
                prenom: true,
              },
            },
          },
        },
      },
    });
    c.status(200);
    return c.json({ courses });
  })
  .get("/:id{[0-9]+}", async (c) => {
    const coursId = Number.parseInt(c.req.param("id"));
    const cours = await prisma.cours.findUnique({
      where: { id_cours: coursId },
      select: {
        id_cours: true,
        titre: true,
        dateDebut: true,
        dateFin: true,
        courMatiere: {
          select: {
            nom: true,
            enseignant: {
              select: {
                nom: true,
                prenom: true,
              },
            },
          },
        },
      },
    });
    if (!cours) {
      c.status(404);
      return c.json({ message: "Cours non trouvé" });
    }
    c.status(200);
    return c.json({ cours });
  })
  .post("/", zValidator("json", postCoursSchema), async (c) => {
    const body = await c.req.valid("json");
    try {
      const existingCours = await prisma.cours.findUnique({
        where: {
          titre: body.titre,
        },
      });

      if (existingCours) {
        c.status(401);
        return c.json({
          message: "Cours existe déjà",
        });
      }

      const newCours = await prisma.cours.create({
        data: {
          titre: body.titre,
          dateDebut: new Date(body.dateDebut).toISOString(),
          dateFin: new Date(body.dateFin).toISOString(),
          courMatiere: {
            connect: {
              id_matiere: body.id_matiere,
            },
          },
        },
      });

      c.status(200);
      return c.json({ newCours });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error.message });
    }
  })
  .put("/:id{[0-9]+}", zValidator("json", updateCoursSchema), async (c) => {
    const coursId = Number.parseInt(c.req.param("id"));
    const body = await c.req.valid("json");
    try {
      const cours = await prisma.cours.findUnique({
        where: { id_cours: coursId },
      });
      if (!cours) {
        c.status(404);
        return c.json({
          message: "Cours non trouvé",
        });
      }
      const existingCourse = await prisma.cours.findUnique({
        where: {
          titre: body.titre,
        },
      });

      if (existingCourse && existingCourse.id_cours !== coursId) {
        c.status(401);
        return c.json({
          message: "Cours existe déjà",
        });
      }

      const updatedCours = await prisma.cours.update({
        where: {
          id_cours: coursId,
        },
        data: {
          titre: body.titre,
          dateDebut: new Date(body.dateDebut).toISOString(),
          dateFin: new Date(body.dateFin).toISOString(),
        },
      });

      c.status(200);
      return c.json({ updatedCours });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error.message });
    }
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const coursId = Number.parseInt(c.req.param("id"));
    try {
      const cours = await prisma.cours.findUnique({
        where: { id_cours: coursId },
      });
      if (!cours) {
        c.status(404);
        return c.json({
          message: "Cours non trouvé",
        });
      }

      const deletedCours = await prisma.cours.delete({
        where: {
          id_cours: coursId,
        },
      });

      c.status(200);
      return c.json({ deletedCours });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error.message });
    }
  });
