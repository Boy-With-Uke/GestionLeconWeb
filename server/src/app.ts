import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { userRoutes } from "./routes/User";
import { classesRoutes } from "./routes/Class";
const app = new Hono();
app.use("*", logger());

app.basePath("/api").route("/user", userRoutes).route("/classe", classesRoutes);

app.use("/static/*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "frontend/dist/index.html" }));

export default app;
