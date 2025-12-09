import { Request, Response } from "express";
import { authServices } from "./auth.services";

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
  loginUser
}