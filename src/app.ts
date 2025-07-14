import cors from "cors";
import express, { Application } from "express";
import { UserRoutes } from "./app/modules/user/user.route";

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/v1/users", UserRoutes);

export default app;
