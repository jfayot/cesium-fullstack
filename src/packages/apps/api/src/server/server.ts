import express from "express";
import http from "http";

export function startServer(
  port: number,
  folder: string | undefined
): http.Server {
  const app = express();

  if (folder !== undefined) {
    console.log(folder);
    app.use(express.static(folder));
  }

  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server started at: http://127.0.0.1:${port}`);
  });

  return server;
}
