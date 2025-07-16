import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { unknownEndpoint } from "./app/middlewares/unknownEndpoint";
import { RoutesHandler } from "./app/routes";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/v1", RoutesHandler);

app.use(unknownEndpoint);
app.use(globalErrorHandler);

export default app;
