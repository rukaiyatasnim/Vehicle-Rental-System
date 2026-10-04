import { Router } from "express";
import { vehicleController } from "./vehicles.controller.js";
import auth from "../../middlewear/auth.js";


const router = Router();

router.get("/" , auth("admin"), vehicleController.getVehicles)
router.post("/" , vehicleController.postVehicles)
router.get("/:id" , vehicleController.getSingleVehicle)
router.put("/:id" , auth("admin"), vehicleController.updateVehicle)
router.delete("/:id" , auth("admin"), vehicleController.deleteVehicle)


export const vehicleRoutes = router