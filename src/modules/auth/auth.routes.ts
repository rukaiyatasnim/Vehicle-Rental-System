import { Router } from "express";
import { authController } from "./auth.controller.js";

const router = Router();

router.post("/signup", authController.createUser )
router.post("/signin", authController.loginUser)



export const authRoutes = router