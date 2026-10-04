import { Router } from "express";
import { userController } from "./user.controller.js";
import auth from "../../middlewear/auth.js";

const router = Router();

router.get("/", auth("admin"), userController.getUser)
router.put("/:id" ,auth("admin" , "customer") , userController.updateUser)
router.delete("/:id", auth("admin"), userController.deletUser)


export const userRoutes =router