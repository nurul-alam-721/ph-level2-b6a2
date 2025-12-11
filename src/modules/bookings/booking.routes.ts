import { Router } from "express";
import { bookingControllers } from "./booking.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.post('/', auth('admin', 'customer'), bookingControllers.createBooking);


export const bookingRoutes = router;