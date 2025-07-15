import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.get("/", UserController.getAllUsers);

export const UserRoutes = router;
