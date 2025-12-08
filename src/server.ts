import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { authRoutes } from "./modules/users/user.routes";
const app = express();
const port = config.port;

//parser
app.use(express.json());

//initialization
initDB();

//user authRoutes
app.use('/users', authRoutes);

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

app.listen(port, () => {
  console.log(`Assignment-2 app listening on port ${port}`);
});
