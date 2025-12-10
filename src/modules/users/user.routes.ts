import { Router } from "express";
import { userControllers } from "./user.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", userControllers.createUser);

router.get("/", auth('admin'), userControllers.getUsers);

export const userRoutes = router;
