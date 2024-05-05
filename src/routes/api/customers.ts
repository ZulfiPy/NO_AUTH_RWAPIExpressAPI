import express from "express";
import { getCustomers, createCustomer } from "../../controllers/customersController";

const router = express.Router();

// /api/customers routes
router.get('/', getCustomers);
router.post('/', createCustomer);

export default router;