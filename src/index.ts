import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { config, Environment, startServer } from "@monorepo/api";

// __dirname is not available in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SIGINT is not emitted on windows
if (process.platform === "win32") {
  const rl = readline.createInterface({
    input,
    output,
  });

  rl.on("SIGINT", () => {
    process.emit("SIGINT");
  });
}

const port = parseInt(config.port + "");
const folder =
  config.environment === Environment.Production ? __dirname : undefined;

const server = startServer(port, folder);

process.on("SIGINT", () => {
  server.close(() => {
    process.exit(0);
  });
});
