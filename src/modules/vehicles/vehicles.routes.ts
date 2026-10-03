import { Router } from "express";
import { vehicleController } from "./vehicles.controller.js";


const router = Router();

router.get("/" , vehicleController.getVehicles)
router.post("/" , vehicleController.postVehicles)
router.get("/:id" , vehicleController.getSingleVehicle)
router.put("/:id" , vehicleController.updateVehicle)
router.delete("/:id" , vehicleController.deleteVehicle)


export const vehicleRoutes = router