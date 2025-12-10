import { Router } from "express";
import { vehicleControllers } from "./vehicle.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.post('/', auth('admin'), vehicleControllers.createVehicle);

router.get('/', vehicleControllers.getAllVehicles);

router.get('/:vehicleId', vehicleControllers.getSingleVehicle);

router.put('/:vehicleId', auth('admin'), vehicleControllers.updateVehicle);

export const vehicleRoutes = router; 