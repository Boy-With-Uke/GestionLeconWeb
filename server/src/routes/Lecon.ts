import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import * as fs from "fs";
import { connect } from "bun";
import { select } from "@material-tailwind/react";
const path = require("path");

const prisma = new PrismaClient();

export const LessonRoutes = new Hono()
  .get("/", async (c) => {
    const lessons = await prisma.lecon.findMany({
      select: {
        id_lecon: true,
        titre: true,
        contenue: true,
        typeLecon: true,
        matiereLesson: {
          select: {
            matiere: {
              select: {
                nom: true,
              },
            },
          },
        },
      },
    });
    c.status(200);
    return c.json({ lessons });
  })
  .get("/favoris/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const lessons = await prisma.usersFavLecon.findMany({
      where: {
        userId: id,
      },
      select: {
        lessons: {
          select: {
            id_lecon: true,
            titre: true,
            contenue: true,
            typeLecon: true,
            matiereLesson: {
              select: {
                matiere: {
                  select: {
                    nom: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    c.status(200);
    return c.json({ lessons });
  })
  .get("/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const lessons = await prisma.lecon.findUnique({
      where: {
        id_lecon: id,
      },
      select: {
        id_lecon: true,
        titre: true,
        contenue: true,
        typeLecon: true,
        matiereLesson: {
          select: {
            matiere: {
              select: {
                nom: true,
              },
            },
          },
        },
      },
    });
    c.status(200);
    return c.json({ lessons });
  })
  .post("/", async (c) => {
    const data = await c.req.formData();
    const file = data.get("file");
    const fileName = data.get("filename") as string;
    const titre = data.get("titre") as string;
    const type = data.get("typeLecon") as string;
    const matiere = data.get("matiere");

    if (!file || !(file instanceof File)) {
      c.status(400);
      return c.json({ message: "Invalid file input" });
    }

    const buffer = await file.arrayBuffer();
    try {
      const existingMatiere = await prisma.matiere.findUnique({
        where: {
          id_matiere: parseInt(matiere as string),
        },
      });
      if (!existingMatiere) {
        c.status(401);
        return c.json({
          message: "Matiere non existante",
        });
      }

      let existingLessonOrEva;
      if (type === "LESSON") {
        existingLessonOrEva = await prisma.lecon.findFirst({
          where: {
            titre: titre,
            typeLecon: "LESSON",
          },
        });
      } else if (type === "EVALUATION") {
        existingLessonOrEva = await prisma.lecon.findFirst({
          where: {
            titre: titre,
            typeLecon: "EVALUATION",
          },
        });
      }

      if (existingLessonOrEva) {
        c.status(401);
        return c.json({
          message:
            type === "LESSON"
              ? "Leçon déjà existante"
              : "Évaluation déjà existante",
        });
      }

      fs.writeFileSync(
        path.join(__dirname, "../../../frontend/public/Pdf/Lecon", fileName),
        Buffer.from(buffer)
      );

      const newLesson = await prisma.lecon.create({
        data: {
          titre: titre || "",
          contenue: `/Pdf/Lecon/${fileName}`,
          typeLecon: type || "",
        },
      });

      if (matiere !== null) {
        const LessonSubjectLink = await prisma.matiereContenantLecon.create({
          data: {
            matiere: { connect: { id_matiere: parseInt(matiere as string) } },
            lessons: { connect: { id_lecon: newLesson.id_lecon } },
          },
        });
      }

      c.status(200);
      return c.json({
        message:
          type === "LESSON"
            ? "Nouvelle lecon ajouter avec succes"
            : "Nouvelle evaluations ajouter avec succes",
        newLesson,
      });
    } catch (error) {
      c.status(500);
      return c.json({ error });
    }
  })
  .put("/", async (c) => {
    const data = await c.req.formData();
    const file = data.get("file");
    const fileName = data.get("filename") as string;
    const idLecon = data.get("id");
    const type = data.get("typeLecon") as string;
    const matiere = data.get("matiere");

    const newTitre = data.get("newTitre") as string;

    if (!file || !(file instanceof File)) {
      c.status(400);
      return c.json({ message: "Invalid file input" });
    }

    const buffer = await file.arrayBuffer();
    try {
      const existingMatiere = await prisma.matiere.findUnique({
        where: {
          id_matiere: parseInt(matiere as string),
        },
      });
      if (!existingMatiere) {
        c.status(401);
        return c.json({
          message: "Matiere non existante",
        });
      }

      const existingLessonOrEva = await prisma.lecon.findUnique({
        where: {
          id_lecon: parseInt(idLecon as string),
        },
      });

      if (!existingLessonOrEva || existingLessonOrEva.typeLecon !== type) {
        c.status(401);
        return c.json({
          message:
            type === "LESSON"
              ? "Leçon non existante"
              : "Évaluation non existante",
        });
      }

      // Supprimer l'ancien fichier PDF
      const oldFilePath = path.join(
        __dirname,
        "../../../frontend/public",
        existingLessonOrEva.contenue
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Écrire le nouveau fichier PDF
      const newFilePath = path.join(
        __dirname,
        "../../../frontend/public/Pdf/Lecon",
        fileName
      );
      fs.writeFileSync(newFilePath, Buffer.from(buffer));

      // Mettre à jour la leçon
      const updatedLesson = await prisma.lecon.update({
        where: {
          id_lecon: existingLessonOrEva.id_lecon,
        },
        data: {
          titre: newTitre || "",
          contenue: `/Pdf/Lecon/${fileName}`,
          typeLecon: type || "",
        },
      });

      // Mettre à jour la liaison entre la matière et la leçon
      const LessonSubjectLink = await prisma.matiereContenantLecon.upsert({
        where: {
          matieresId_lessonId: {
            matieresId: existingMatiere.id_matiere,
            lessonId: existingLessonOrEva.id_lecon,
          },
        },
        update: {
          matiere: { connect: { id_matiere: parseInt(matiere as string) } },
          lessons: { connect: { id_lecon: updatedLesson.id_lecon } },
        },
        create: {
          matiere: { connect: { id_matiere: parseInt(matiere as string) } },
          lessons: { connect: { id_lecon: updatedLesson.id_lecon } },
        },
      });

      c.status(200);
      return c.json({
        message:
          type === "LESSON"
            ? "Mise à jour de la leçon réussie"
            : "Mise à jour de l'évaluation réussie",
        updatedLesson: updatedLesson,
      });
    } catch (error) {
      c.status(500);
      return c.json({ error });
    }
  });

