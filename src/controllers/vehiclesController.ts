import { Request, Response } from "express";
import { getPool } from "../config/pgDBConn";
import pgConn from "../config/pgDBConn";

const getVehicles = async (req: Request, res: Response) => {
    const database = process.env.PG_VEHICLES_DB as string;
    await pgConn(database);

    try {
        const pool = getPool(database);

        const vehiclesPool = await pool.query('SELECT * FROM vehicles');

        return res.status(200).json({ 'message': vehiclesPool.rowCount === 0 ? 0 : vehiclesPool.rows });
    } catch (error) {
        console.log('error occured while reading vehicles, error:', error);
        return res.status(500).json({ 'message': 'something went wrong' });
    }
}

const getVehicleByPlateNumber = async (req: Request, res: Response) => {
    const database = process.env.PG_VEHICLES_DB as string;
    await pgConn(database);

    const { plateNumber } = req.params;

    try {
        const pool = getPool(database);

        const vehiclePool = await pool.query(`SELECT * FROM vehicles WHERE plate_number = ($1);`, [plateNumber]);

        return res.status(200).json({ 'vehicle': vehiclePool.rowCount === 0 ? 0 : vehiclePool.rows })
    } catch (error) {
        console.log('error occured while reading vehicle, error:', error);
        return res.status(500).json({ 'message': 'something went wrong' });
    }
}

const createVehicle = async (req: Request, res: Response) => {
    const database = process.env.PG_VEHICLES_DB as string;
    await pgConn(database);

    if (!req.body) {
        return res.status(400).json({ 'message': "body of your request is empty" });
    }

    const fieldNames = ['vin_code', 'plate_number', 'brand', 'model', 'year', 'gearbox', 'colour'];

    for (let field of fieldNames) {
        if (!req.body?.[field]) {
            return res.status(400).json({ 'message': `please provide ${field}` });
        }
    }

    const { vin_code, plate_number, brand, model, year, gearbox, colour } = req.body;

    try {
        const pool = getPool(database);

        const newVehiclePool = await pool.query('INSERT INTO vehicles (vin_code, plate_number, brand, model, year, gearbox, colour) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', [vin_code, plate_number, brand, model, year, gearbox, colour]);

        return res.status(200).json({ 'message': newVehiclePool.rowCount === 0 ? 0 : newVehiclePool.rows[0] })
    } catch (error) {
        console.log('error occured while creating vehicles, error:', error);
        return res.status(500).json({ 'message': 'something went wrong' });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    const database = process.env.PG_VEHICLES_DB as string;
    await pgConn(database);

    if (!req.body) {
        return res.status(400).json({ 'message': "body of your request is empty" });
    }

    const fieldNames = ['vin_code', 'plate_number', 'brand', 'model', 'year', 'gearbox', 'colour'];

    for (let field of fieldNames) {
        if (!req.body?.[field]) {
            return res.status(400).json({ 'message': `please provide ${field}` });
        }
    }

    const { vin_code, plate_number, brand, model, year, gearbox, colour } = req.body;
    const { id } = req.params;

    try {
        const pool = getPool(database);

        const updatedVehiclePool = await pool.query('UPDATE vehicles SET vin_code = ($1), plate_number = ($2), brand = ($3), model = ($4), year = ($5), gearbox = ($6), colour = ($7) where id = ($8) RETURNING *;', [vin_code, plate_number, brand, model, year, gearbox, colour, id]);

        return res.status(200).json({ 'message': updatedVehiclePool.rowCount === 0 ? 0 : updatedVehiclePool.rows[0] })
    } catch (error) {
        console.log('error occured while creating vehicles, error:', error);
        return res.status(500).json({ 'message': 'something went wrong' });
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    const database = process.env.PG_VEHICLES_DB as string;
    await pgConn(database);

    const { id } = req.params;

    try {
        const pool = getPool(database);
        
        const deletedVehiclePool = await pool.query('DELETE FROM vehicles WHERE id = ($1);', [id])

        return res.status(200).json({ 'message': deletedVehiclePool.rowCount === 0 ? 0 : "vehicle deleted" });
    } catch (error) {
        console.log('error occured while deleting vehicle, error:', error);
        return res.status(500).json({ 'message': 'something went wrong' });
    }
}

export {
    getVehicles,
    getVehicleByPlateNumber,
    createVehicle,
    updateVehicle,
    deleteVehicle
}