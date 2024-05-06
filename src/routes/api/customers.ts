import express from "express";
import { getCustomers, getCustomer, createCustomer } from "../../controllers/customersController";

const router = express.Router();

// /api/customers routes
router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.post('/', createCustomer);

export default router;