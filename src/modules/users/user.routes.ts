import { Router } from "express";
import { userController } from "./user.controller.js";

const router = Router();

router.get("/", userController.getUser)
router.put("/:id" ,  userController.updateUser)
router.delete("/:id", userController.deletUser)


export const userRoutes =router