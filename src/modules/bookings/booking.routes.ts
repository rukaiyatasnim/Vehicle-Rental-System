import { Router } from "express";
import { bookingController } from "./booking.controller.js";
import auth from "../../middlewear/auth.js";


const router = Router()

router.post("/",auth("admin", "customer"),bookingController.createBooking)

router.get("/",auth("admin", "customer"),bookingController.getBooking)

router.put("/:id",auth("admin", "customer"),bookingController.updateBooking)

export const bookingRoutes = router