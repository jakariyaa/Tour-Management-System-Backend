import { Router } from "express";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { resetPasswordZodSchema } from "../user/user.validation";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.generateNewAccessToken);
router.post("/logout", AuthController.credentialsLogout);
router.post(
  "/reset-password",
  validateRequest(resetPasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthController.resetPassword
);
router.get("/google", AuthController.googleController);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthController.googleCallbackController
);

export const AuthRoutes = router;
