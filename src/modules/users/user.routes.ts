import { Router } from "express";
import { userControllers } from "./user.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/", auth('admin'), userControllers.getUsers);

router.delete("/:userId", auth('admin'), userControllers.deleteUser);

router.put("/:userId", auth('admin', 'customer'), userControllers.updateUser);

export const userRoutes = router;
