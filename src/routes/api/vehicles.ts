import express from "express";
import { getVehicles, getVehicleByPlateNumber, createVehicle, updateVehicle, deleteVehicle } from "../../controllers/vehiclesController";

const router = express.Router();

router.get('/', getVehicles);
router.get('/:plateNumber', getVehicleByPlateNumber);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle)

export default router;