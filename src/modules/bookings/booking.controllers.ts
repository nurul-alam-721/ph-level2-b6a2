import { Request, Response } from "express";
import { bookingServices } from "./booking.services";
import { pool } from "../../config/db";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingServices.createBooking(req.body);

    return res.status(201).json({
      success: true,
      message: "Bookings created successfully",
      data: [booking],
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


const getBookings = async (req: Request, res: Response) => {
  try {
    if (req.user?.role === "admin") {
      const bookings = await bookingServices.getAllBookings();
      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings
      });
    }

    if (req.user?.role === "customer") {
      const bookings = await bookingServices.getBookingsByCustomer(Number(req.user.id));
      return res.status(200).json({
        success: true,
        message: "Your bookings retrieved successfully",
        data: bookings
      });
    }

    return res.status(403).json({
      success: false,
      message: "Unauthorized"
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};





const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const user = req.user!;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required!",
      });
    }

    const bookingResult = await bookingServices.getSingleBooking(bookingId as string);
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found!",
      });
    }

    const booking = bookingResult.rows[0];

    if (user.role === "customer") {
      if (booking.customer_id !== user.id) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own bookings!",
        });
      }

      if (status !== "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Customers can only cancel their bookings!",
        });
      }

      if (new Date() >= new Date(booking.rent_start_date)) {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel booking after start date!",
        });
      }

      const cancelled = await bookingServices.cancelBooking(bookingId as string);

      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: cancelled.rows[0],
      });
    }

    if (user.role === "admin") {
      if (status !== "returned") {
        return res.status(400).json({
          success: false,
          message: "Admin must set status to returned",
        });
      }

      const updatedBooking = await bookingServices.markReturned(
        bookingId as string,
        booking.vehicle_id
      );

      const vehicleResult = await pool.query(
        `SELECT availability_status FROM vehicles WHERE id = $1`,
        [booking.vehicle_id]
      );

      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: {
          ...updatedBooking.rows[0],
          vehicle: {
            availability_status: vehicleResult.rows[0].availability_status,
          },
        },
      });
    }

    return res.status(403).json({
      success: false,
      message: "Forbidden action!",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking
}