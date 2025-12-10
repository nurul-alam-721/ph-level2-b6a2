import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";

const createVehicle =  async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No vehicles found!",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully!",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getSingleVehicle(
      req.params.vehicleId as string
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found!",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

  try {
    const result = await vehicleServices.updateVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId as string
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle
}