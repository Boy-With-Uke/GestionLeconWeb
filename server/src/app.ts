import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { userRoutes } from "./routes/User";
const app = new Hono();
app.use("*", logger());

app.basePath("/api").route("/user", userRoutes);

app.use("/static/*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "frontend/dist/index.html" }));

export default app;
