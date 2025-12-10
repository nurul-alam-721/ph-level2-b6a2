import { Router } from "express";
import { vehicleControllers } from "./vehicle.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.post('/', auth('admin'), vehicleControllers.createVehicle);

export const vehicleRoutes = router; 