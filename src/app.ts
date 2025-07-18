import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import expressSession from "express-session";
import passport from "passport";
import { env } from "./app/config/env";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { unknownEndpoint } from "./app/middlewares/unknownEndpoint";
import { RoutesHandler } from "./app/routes";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173" }));

app.use(
  expressSession({
    secret: env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", RoutesHandler);

app.use(unknownEndpoint);
app.use(globalErrorHandler);

export default app;
