import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { number, z } from "zod";

const prisma = new PrismaClient();

const matiereSchema = z.object({
  id_matiere: z.number(),
  nom: z.string(),
  description: z.string(),
  enseignantDelaMatiere: z.number().min(1),
});

const postMatiereSchema = matiereSchema
  .omit({ id_matiere: true })
  .extend({ id_classe: z.number().min(1) });

const addToClasseSchema = matiereSchema
  .omit({
    nom: true,
    description: true,
    enseignantDelaMatiere: true,
  })
  .extend({ id_classe: z.number().min(1) });

const updateMatiereSchema = matiereSchema.omit({
  id_matiere: true,
  enseignantDelaMatiere: true,
});
const deleteMatiereSchema = matiereSchema.omit({
  nom: true,
  description: true,
  enseignantDelaMatiere: true,
});
export const subjectRoutes = new Hono()
  .get("/", async (c) => {
    const matieres = await prisma.matiere.findMany({});
    c.status(200);
    return c.json({ Matiere: matieres });
  })
  .get("/:id{[0-9]+}", async (c) => {
    const matiereId = Number.parseInt(c.req.param("id"));
    const matiere = await prisma.matiere.findUnique({
      where: { id_matiere: matiereId },
    });
    c.status(200);
    return c.json({ matiere });
  })
  .post("/", zValidator("json", postMatiereSchema), async (c) => {
    const body = await c.req.valid("json");
    try {
      const existingClasse = await prisma.classe.findUnique({
        where: {
          id_classe: body.id_classe,
        },
      });
      const existingTeacher = await prisma.user.findFirst({
        where: {
          id_user: body.enseignantDelaMatiere,
          niveauAccess: "ENSEIGNANT",
        },
      });

      if (!existingTeacher) {
        c.status(401);
        return c.json({
          message: "Professeur non existant",
        });
      }
      if (!existingClasse) {
        c.status(401);
        return c.json({
          message: "Classe non existante",
        });
      }
      const newMatiere = await prisma.matiere.create({
        data: {
          nom: body.nom,
          description: body.description,
          enseignant: {
            connect: {
              id_user: body.enseignantDelaMatiere,
            },
          },
        },
      });
      const SubjectClassLink = await prisma.matiereDeLaClasse.create({
        data: {
          matieres: { connect: { id_matiere: newMatiere.id_matiere } },
          classes: { connect: { id_classe: existingClasse.id_classe } },
        },
        select: {
          classes: {
            select: {
              nomClasse: true,
            },
          },
        },
      });
      c.status(200);
      return c.json({ newMatiere, SubjectClassLink });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })
  .put(
    "/addToAnotherClass",
    zValidator("json", addToClasseSchema),
    async (c) => {
      const body = await c.req.valid("json");
      try {
        const existingMatiere = await prisma.matiere.findUnique({
          where: {
            id_matiere: body.id_matiere,
          },
        });

        if (!existingMatiere) {
          c.status(401);
          return c.json({
            message: "Matiere non existante",
          });
        }
        const existingClasse = await prisma.classe.findUnique({
          where: {
            id_classe: body.id_classe,
          },
        });
        if (!existingClasse) {
          c.status(401);
          return c.json({
            message: "Classe non existante",
          });
        }
        const updatedMatiere = await prisma.matiere.findUnique({
          where: {
            id_matiere: body.id_matiere,
          },
        });

        const SubjectClassLink = await prisma.matiereDeLaClasse.upsert({
          where: {
            classId_matiereId: {
              classId: existingClasse.id_classe,
              matiereId: body.id_matiere,
            },
          },
          update: {
            matieres: { connect: { id_matiere: updatedMatiere?.id_matiere } },
            classes: { connect: { id_classe: existingClasse.id_classe } },
          },
          create: {
            matieres: { connect: { id_matiere: updatedMatiere?.id_matiere } },
            classes: { connect: { id_classe: existingClasse.id_classe } },
          },
          select: {
            classes: {
              select: {
                nomClasse: true,
              },
            },
          },
        });

        c.status(200);
        return c.json({ updatedMatiere, SubjectClassLink });
      } catch (error) {
        c.status(500);
        return c.json({ Error: error });
      }
    }
  )
  .put("/:id{[0-9]+}", zValidator("json", updateMatiereSchema), async (c) => {
    const matiereId = Number.parseInt(c.req.param("id"));
    const body = await c.req.valid("json");
    try {
      const existingMatiere = await prisma.matiere.findUnique({
        where: {
          id_matiere: matiereId,
        },
      });

      if (!existingMatiere) {
        c.status(401);
        return c.json({
          message: "Matiere non existante",
        });
      }
      const updatedMatiere = await prisma.matiere.update({
        where: {
          id_matiere: matiereId,
        },
        data: {
          nom: body.nom,
          description: body.description,
        },
      });

      c.status(200);
      return c.json({
        updatedMatiere,
        message: "Mise a jour de la matiere est un succes",
      });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const matiereId = Number.parseInt(c.req.param("id"));
    try {
      const existingMatiere = await prisma.matiere.findUnique({
        where: {
          id_matiere: matiereId,
        },
      });

      if (!existingMatiere) {
        c.status(401);
        return c.json({
          message: "Matiere non existante",
        });
      }
      const deletedMatiere = await prisma.matiere.delete({
        where: {
          id_matiere: matiereId,
        },
      });

      c.status(200);
      return c.json({
        deletedMatiere,
        message: " Suppression de la matiere est un succes",
      });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  });
