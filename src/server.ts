/* eslint-disable no-console */
import "dotenv/config";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { env } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    const result = await mongoose.connect(env.MONGO_URI);
    console.log("Connected to MongoDB:", result.connection.name);

    server = app.listen(env.PORT, () => {
      console.log("Server started on port", env.PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  startServer();
  seedSuperAdmin();
})();

process.on("SIGINT", () => {
  console.log("Received SIGINT signal. Server shutting down...");
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM signal. Server shutting down...");
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("unhandledRejection", (error) => {
  console.log("Server shutting down...");
  console.log("Unhandled Rejection Error Detected... \n", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

//Promise.reject(new Error("Unhandled Rejection Error Provided"));

process.on("uncaughtException", (error) => {
  console.log("Server shutting down...");
  console.log("Uncaught Exception Error Detected... \n", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

//throw new Error("Uncaught Exception Error Provided");
