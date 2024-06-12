import app from "./src/app";

Bun.serve({
  fetch: app.fetch,
});
console.log("Server is running on http://localhost:3000");
