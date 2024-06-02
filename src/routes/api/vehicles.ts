import express from "express";
import { getVehicles, getVehicleById, createVehicle, updateVehicleById, deleteVehicleById } from "../../controllers/vehiclesController";

const router = express.Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', createVehicle);
router.put('/:id', updateVehicleById);
router.delete('/:id', deleteVehicleById);

export default router;