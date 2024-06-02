import { Request, Response } from "express";
import pgConn from "../config/supabasePGDbConn";
import { getPool } from "../config/supabasePGDbConn";

const getCustomers = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    try {
        const pool = getPool(database);

        const customersPool = await pool.query('SELECT * FROM customers;');

        return res.status(200).json({ 'customers': customersPool.rowCount === 0 ? 0 : customersPool.rows });
    } catch (error) {
        console.log('error occurred while reading customers', error);
        return res.status(500).json(error);
    }
}

const getCustomerById = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    const { id } = req.params;

    try {
        const pool = getPool(database);

        const customerPool = await pool.query('SELECT * FROM customers WHERE id = ($1);', [id]);

        return res.status(200).json({ 'customer': customerPool.rowCount === 0 ? 0 : customerPool.rows[0] });
    } catch (error) {
        console.log('error occurred while reading customer by id', error);
        return res.status(500).json(error);
    }
}

const createCustomer = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    const fieldNames = ['first_name', 'last_name', 'birth_date', 'drivers_license_number', 'phone_number', 'email', 'address'];

    if (Object.values(req.body).length === 0) {
        return res.status(400).json({ 'message': 'body of your request is empty' });
    }

    for (let field of fieldNames) {
        if (!req.body?.[field]) {
            return res.status(400).json({ 'message': `${field} field is empty, please provide it` });
        }
    }

    const { first_name, last_name, birth_date, is_estonian_resident, personal_id_number, drivers_license_number, address, phone_number, email } = req.body;

    try {
        const pool = getPool(database);

        const createdCustomerPool = await pool.query('INSERT INTO customers (first_name, last_name, is_estonian_resident, personal_id_number, birth_date, drivers_license_number, address, phone_number, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;', [first_name, last_name, is_estonian_resident, personal_id_number, birth_date, drivers_license_number, address, phone_number, email]);

        return res.status(200).json({ 'message': createdCustomerPool.rowCount === 0 ? 0 : createdCustomerPool.rows[0] });
    } catch (error) {
        console.log('error occurred while creating customer', error);
        return res.status(500).json(error);
    }
}

const updateCustomerById = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    const fieldNames = ['first_name', 'last_name', 'is_estonian_resident', 'birth_date', 'drivers_license_number', 'phone_number', 'email', 'address'];

    if (Object.values(req.body).length === 0) {
        return res.status(400).json({ 'message': 'body of your request is empty' });
    }

    for (let field of fieldNames) {
        if (!req.body?.[field]) {
            return res.status(400).json({ 'message': `${field} field is empty, please provide it` });
        }
    }

    const { first_name, last_name, birth_date, is_estonian_resident, personal_id_number, drivers_license_number, phone_number, email, address } = req.body;

    const { id } = req.params;

    try {
        const pool = getPool(database);

        const updatedCustomerPool = await pool.query('UPDATE customers SET first_name = ($1), last_name = ($2), is_estonian_resident = ($3), personal_id_number = ($4), birth_date = ($5), drivers_license_number = ($6), phone_number = ($7), email = ($8), address = ($9) WHERE id = ($10) RETURNING *;', [first_name, last_name, is_estonian_resident, personal_id_number, birth_date, drivers_license_number, phone_number, email, address, id]);

        return res.status(200).json({ 'message': updatedCustomerPool.rowCount === 0 ? 0 : updatedCustomerPool.rows[0] });
    } catch (error) {
        console.log('error occurred while updating customer:', error);
        return res.status(500).json(error);
    }
}

const deleteCustomerById = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    const { id } = req.params;

    try {
        const pool = getPool(database);

        const deletedCustomerPool = await pool.query('DELETE FROM customers WHERE id = ($1)', [id]);

        return res.status(200).json({ 'message': deletedCustomerPool.rowCount === 0 ? 0 : 1 });
    } catch (error) {
        console.log('error occurred while deleting task, error', error);
        return res.status(500).json(error);
    }
}

export {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomerById,
    deleteCustomerById,
}