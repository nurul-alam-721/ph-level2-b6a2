import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const createBooking =  async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const getBookings = async (req: Request, res: Response) => {
  try {
    if (req.user?.role === "admin") {
      const result = await bookingServices.getAllBookings();

      return res.status(200).json({
        success: true,
        message: "All bookings retrieved successfully",
        data: result.rows,
      });
    }

    if (req.user?.role === "customer") {
      const result = await bookingServices.getBookingsByCustomer(
        Number(req.user.id)
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "You have no bookings",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Your bookings retrieved successfully",
        data: result.rows,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
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

    const result = await bookingServices.getSingleBooking(bookingId as string);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found!",
      });
    }

    const booking = result.rows[0];

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

      const updated = await bookingServices.markReturned(
        bookingId as string,
        booking.vehicle_id
      );

      return res.status(200).json({
        success: true,
        message: "Booking marked as returned successfully",
        data: updated.rows[0],
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