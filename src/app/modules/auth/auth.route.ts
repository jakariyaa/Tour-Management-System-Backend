import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.get("/refresh-token", AuthController.generateNewAccessToken);

export const AuthRoutes = router;
