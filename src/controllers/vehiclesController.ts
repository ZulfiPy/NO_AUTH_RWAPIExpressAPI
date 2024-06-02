import { Request, Response } from "express";
import pgConn from "../config/supabasePGDbConn";
import { getPool } from "../config/supabasePGDbConn";

const getVehicles = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    try {
        const pool = getPool(database);

        const vehiclesPool = await pool.query('SELECT * FROM vehicles;');

        return res.status(200).json({ 'vehicles': vehiclesPool.rowCount === 0 ? 0 : vehiclesPool.rows });
    } catch (error) {
        console.log('error occurred while reading vehicles, error:', error);
        return res.status(500).json(error);
    }
}

const getVehicleById = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    const { id } = req.params;

    try {
        const pool = getPool(database);

        const vehiclePool = await pool.query('SELECT * FROM vehicles WHERE id = ($1);', [id]);

        return res.status(200).json({ 'vehicle': vehiclePool.rowCount === 0 ? 0 : vehiclePool.rows[0] });
    } catch (error) {
        console.log('error occurred while reading vehicle, error:', error);
        return res.status(500).json(error);
    }
}

const createVehicle = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    if (!req.body) {
        return res.status(400).json({ 'message': 'body of your request is empty' });
    }

    const fieldNames = ['vin_code', 'plate_number', 'brand', 'model', 'year', 'gearbox', 'fuel_type', 'colour'];

    for (let field of fieldNames) {
        if (!req.body?.[field]) {
            return res.status(400).json({ 'message': `please provide ${field}` });
        }
    }

    const { vin_code, plate_number, brand, model, year, gearbox, fuel_type, colour } = req.body;

    try {
        const pool = getPool(database);

        const newVehiclePool = await pool.query('INSERT INTO vehicles (vin_code, plate_number, brand, model, year, gearbox, fuel_type, colour) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;', [vin_code, plate_number, brand, model, year, gearbox, fuel_type, colour]);

        return res.status(200).json({ 'vehicle': newVehiclePool.rowCount === 0 ? 0 : newVehiclePool.rows[0] });
    } catch (error) {
        console.log('error occurred while creating vehicle, error:', error);
        return res.status(500).json(error);
    }
}

const updateVehicleById = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    if (!req.body) {
        return res.status(400).json({ 'message': 'body of your request is empty' });
    }

    const fieldNames = ['vin_code', 'plate_number', 'brand', 'model', 'year', 'gearbox', 'fuel_type', 'colour'];

    for (let field of fieldNames) {
        if (!req.body?.[field]) {
            return res.status(400).json({ 'message': `please provide ${field}` });
        }
    }

    const { vin_code, plate_number, brand, model, year, gearbox, fuel_type, colour } = req.body;
    const { id } = req.params;

    try {
        const pool = getPool(database);

        const updatedVehiclePool = await pool.query('UPDATE vehicles SET vin_code = ($1), plate_number = ($2), brand = ($3), model = ($4), year = ($5), gearbox = ($6), fuel_type = ($7), colour = ($8) WHERE id = ($9) RETURNING *;', [vin_code, plate_number, brand, model, year, gearbox, fuel_type, colour, id]);

        return res.status(200).json({ 'vehicle': updatedVehiclePool.rowCount === 0 ? 0 : updatedVehiclePool.rows[0] });
    } catch (error) {
        console.log('error occurred while updateing vehicle, error:', error);
        return res.status(500).json(error);
    }
}

const deleteVehicleById = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    const { id } = req.params;

    try {
        const pool = getPool(database);

        const deletedVehiclePool = await pool.query('DELETE FROM vehicles WHERE id = ($1);', [id]);

        return res.status(200).json({ 'message': deletedVehiclePool.rowCount === 0 ? 0 : 'vehicle deleted' });
    } catch (error) {
        console.log('error occurred while deleting vehicle, error:', error);
        return res.status(500).json(error);
    }
}

export {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicleById,
    deleteVehicleById,
}