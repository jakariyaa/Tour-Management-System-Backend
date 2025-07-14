import cors from "cors";
import express, { Application } from "express";
import { RoutesHandler } from "./app/routes";

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/v1", RoutesHandler);

export default app;
