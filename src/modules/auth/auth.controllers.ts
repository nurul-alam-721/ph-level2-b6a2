import { Request, Response } from "express";
import { authServices } from "./auth.services";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signUpUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const loginUser = async(req:Request, res:Response) =>{
  const {email, password} = req.body;
  try{
    const result = await authServices.loginUser(email, password);
     res.status(201).json({
      success: true,
      message: "Login  successful!",
      data: result,
    });
  }
  catch(err:any){
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
}

export const authControllers = {
  signUpUser,
  loginUser
}