import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import * as fs from "fs";
import { connect } from "bun";
const path = require("path");

const prisma = new PrismaClient();

export const LessonRoutes = new Hono()
  .get("/", async (c) => {
    const lessons = await prisma.lecon.findMany({});
    c.status(200);
    return c.json({ lessons });
  })
  .post("/", async (c) => {
    const data = await c.req.formData();
    const file = data.get("file");
    const fileName = data.get("filename") as string;
    const titre = data.get("titre") as string;
    const type = data.get("type") as string;
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
            type: "LESSON",
          },
        });
      } else if (type === "EVALUATION") {
        existingLessonOrEva = await prisma.lecon.findFirst({
          where: {
            titre: titre,
            type: "EVALUATION",
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
          type: type || "",
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
  });
