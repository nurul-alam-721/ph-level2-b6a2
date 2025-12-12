import { Request, Response } from "express";
import { userServices } from "./user.services";


const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
}

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const{name, email, phone} = req.body;

    if (req.user?.role === "customer" && req.user?.id !== Number(userId)) {
      return res.status(403).json({
        success: false,
        message: "Customers can update only their own profile.",
      });
    }

    const role = req.user?.role === "admin" ? req.body.role : undefined;
    if (req.user?.role === "customer" && req.body.role) {
      return res.status(403).json({
        success: false,
        message: "Customers cannot change their role!",
      });
    }

    const result = await userServices.updateUser(
      name,
      email,
      phone,
      role,
      userId as string
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { deletable, result } = await userServices.deleteUser(userId as string);

    if (!deletable) {
      return res.status(400).json({
        success: false,
        message: "User cannot be deleted as he/she has active bookings!",
      });
    }

    if (!result || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const userControllers = {
  getUsers,
  deleteUser,
  updateUser
};
