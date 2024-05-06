import express from "express";
import { getCustomers, getCustomer, createCustomer, updateCustomer } from "../../controllers/customersController";

const router = express.Router();

// /api/customers routes
router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);

export default router;