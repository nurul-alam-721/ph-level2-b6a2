import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";
export const app = express();

//parser
app.use(express.json());

//initialization
initDB();

//user routes
app.use("/api/v1/users", userRoutes);

//auth routes
app.use("/api/v1/auth", authRoutes);

//vehicle routes
app.use("/api/v1/vehicles", vehicleRoutes);

//bookings routes
app.use("/api/v1/bookings", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Assignment-02 (Level-2)!");
});

app.use((req, res) => {
  res.status(404).send({
    success: false,
    message: "Route Not Found",
    path: req.path,
  });
});
