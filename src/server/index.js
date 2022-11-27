import "regenerator-runtime/runtime";
import fastifyCors from "@fastify/cors";
import fastifySensible from "@fastify/sensible";
import fastify from "fastify";

import { User } from "../model/index.js";

import { apiRoute } from "./routes/api.js";
import { spaRoute } from "./routes/spa.js";
import { createConnection } from "./typeorm/connection.js";
import { initialize } from "./typeorm/initialize.js";

const envToLogger = {
  development: {
    transport: {
      options: {
        ignore: "pid,hostname",
        translateTime: "HH:MM:ss Z",
      },
      target: "pino-pretty",
    },
  },
  production: true,
};

const server = fastify({
  logger: envToLogger[process.env.NODE_ENV] ?? true, // defaults to true if no entry matches in the map
});
server.register(fastifySensible);
server.register(fastifyCors);

server.addHook("onRequest", async (req, res) => {
  const repo = (await createConnection()).getRepository(User);

  const userId = req.headers["x-app-userid"];
  if (userId !== undefined) {
    const user = await repo.findOne(userId);
    if (user === undefined) {
      res.unauthorized();
      return;
    }
    req.user = user;
  }
});

server.addHook("onRequest", async (req, res) => {
  const ext = req.url.split(".").pop();
  if (["webp", "html", "ttf", "js", "woff2"].includes(ext)) {
    res.header("Cache-Control", "public, max-age=31536000");
  } else {
    res.header("Cache-Control", "no-cache, no-store, no-transform");
  }
  res.header("Access-Control-Allow-Origin", "*");
});

server.register(apiRoute, { prefix: "/api" });
server.register(spaRoute);

const start = async () => {
  console.log("Server Starting...");
  try {
    await initialize();
    console.log("Server Initialized");
    await server.listen({ host: "0.0.0.0", port: process.env.PORT || 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
