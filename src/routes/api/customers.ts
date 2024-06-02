import express from "express";
import { getCustomers, getCustomerById, createCustomer, updateCustomerById, deleteCustomerById } from "../../controllers/customersController";

const router = express.Router();

// /api/customers routes
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomerById);
router.delete('/:id', deleteCustomerById)

export default router;