import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { userRoutes } from "./routes/User";
import { classesRoutes } from "./routes/Class";
import { subjectRoutes } from "./routes/Matiere";
import { coursesRoutes } from "./routes/Cours";
import { filieresRoutes } from "./routes/Filiere";
import { statRoutes } from "./routes/Stat";
const app = new Hono();

app.use("*", logger());

app
  .basePath("/api")
  .route("/user", userRoutes)
  .route("/classe", classesRoutes)
  .route("/matiere", subjectRoutes)
  .route("/cours", coursesRoutes)
  .route("/filiere", filieresRoutes)
  .route("/stat", statRoutes);

app.use("/static/*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "frontend/dist/index.html" }));

export default app;
