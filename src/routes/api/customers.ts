import express from "express";
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from "../../controllers/customersController";

const router = express.Router();

// /api/customers routes
router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer)

export default router;