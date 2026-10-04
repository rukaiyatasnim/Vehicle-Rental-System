import { Request, Response } from "express";
import { bookingService } from "./booking.service.js";

const createBooking = async (req: Request, res: Response) => {
  try {

    const result = await bookingService.createBooking(
      req.user?.id as string,
      req.body
    )

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getBooking = async (req: Request, res: Response) => {
    try {

        const result = await bookingService.getBooking(
            req.user?.id as string,
            req.user?.role as string
        )

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result.rows
        })

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
const updateBooking = async(req:Request, res:Response) => {
    try {

        const result = await bookingService.updateBooking(
            req.params.id as string,
            req.user?.id as string,
            req.user?.role as string
        )

        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: result.rows[0]
        })

    } catch(err:any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}



export const bookingController = {
    createBooking,
    getBooking,
    updateBooking
}