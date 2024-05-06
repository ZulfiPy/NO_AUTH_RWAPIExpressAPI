import { Request, Response } from "express";
import pgConn from "../config/pgDBConn";
import { getPool } from "../config/pgDBConn";

const getCustomers = async (req: Request, res: Response) => {
    const database = process.env.PG_CUSTOMERS_DB as string;
    await pgConn(database);

    try {
        const pool = getPool(database);

        const customersPool = await pool.query('SELECT * FROM customers;')

        return res.status(200).json({ "customers": customersPool.rowCount === 0 ? "no customers found. database is empty." : customersPool.rows });
    } catch (error) {
        console.log('error occured while reading customers', error);
        return res.status(500).json({ 'message': 'something went wrong' });
    }
}

const getCustomer = async (req: Request, res: Response) => {
    const database = process.env.PG_CUSTOMERS_DB as string;
    await pgConn(database);

    const { id } = req.params;

    try {
        const pool = getPool(database);

        const customerPool = await pool.query('SELECT * FROM customers WHERE personal_id_number = ($1);', [id])

        return res.status(200).json({ 'customer': customerPool.rowCount === 0 ? "customer not found." : customerPool.rows[0] })
    } catch (error) {
        console.log('error occured while reading customer', error);
        return res.status(500).json({ 'message': 'something went wrong' });
    }
}

const createCustomer = async (req: Request, res: Response) => {
    const database = process.env.PG_CUSTOMERS_DB as string;
    await pgConn(database);

    const fieldNames = ['firstName', 'lastName', 'isEstonianResident', 'personalIDNumber', 'birthDate', 'driverLicenseNumber', 'address', 'phoneNumber', 'email'];

    if (Object.values(req.body).length === 0) {
        return res.status(400).json({ 'message': 'body of your request is empty' });
    }

    for (let field of fieldNames) {
        if (!req.body?.[field]) {
            return res.status(400).json({ 'message': `${field} field is empty, please provide it` });
        }
    }

    const { firstName, lastName, isEstonianResident, personalIDNumber, birthDate, driverLicenseNumber, address, phoneNumber, email } = req.body;

    try {
        const pool = getPool(database);

        const createdCustomerPool = await pool.query('INSERT INTO customers (first_name, last_name, is_estonian_resident, personal_id_number, birth_date, driver_license_number, address, phone_number, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;', [firstName, lastName, isEstonianResident, personalIDNumber, birthDate, driverLicenseNumber, address, phoneNumber, email]);

        return res.status(200).json({ 'message': 'new customer created' });
    } catch (error) {
        console.log('error occured while adding new customer to the database, error:', error);
        return res.status(500).json({ 'message': 'something went wrong' });
    }
}

export {
    getCustomers,
    getCustomer,
    createCustomer,
}