import { Request, Response } from "express";
import { userSevices } from "./user.services";

const createUser =  async (req: Request, res: Response) => {
  try {
    const result = await userSevices.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export const userControllers = {
  createUser
}