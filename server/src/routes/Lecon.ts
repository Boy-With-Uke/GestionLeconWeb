import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { number, z } from "zod";

const prisma = new PrismaClient();

export const LessonRoutes = new Hono()

  .get("/", async (c) => {
    const lessons = await prisma.lecon.findMany({});
    c.status(200);
    return c.json({ lessons });
  })

  .post("/", async (c) => {
    console.log(c.req.formData());
    const data = await c.req.formData();

    
    const file = data.get("file");
  });
