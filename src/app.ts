import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
export const app = express();

//parser
app.use(express.json());

//initialization
initDB();

//user routes
app.use('/api/v1/users', userRoutes);

//auth routes
app.use('/api/v1/auth', authRoutes)

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

