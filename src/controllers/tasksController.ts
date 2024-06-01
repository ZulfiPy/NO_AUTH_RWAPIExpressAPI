import { Request, Response } from "express";
import pgConn from "../config/supabasePGDbConn";
import { getPool } from "../config/supabasePGDbConn";
import jwt from "jsonwebtoken";

const getTasks = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    const decoded = jwt.decode(req?.cookies['next-auth.session-token']);

    if (typeof decoded === 'object' && decoded !== null && 'user' in decoded) {

        const userInfo = decoded.user;
        const username = userInfo?.username;

        try {
            const pool = getPool(database);

            const tasks = await pool.query('SELECT * FROM tasks WHERE created_by = ($1);', [username]);

            return res.status(200).json({ "tasks": tasks.rowCount === 0 ? 0 : tasks.rows });
        } catch (error) {
            console.log('error occurred while reading tasks:', error);
            return res.status(500).json(error);
        }
    }

    return res.status(401).json({ 'message': 'provide session token' })
}

const getTasksByUsername = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    try {
        const pool = getPool(database);

        const { username } = req.params
        const tasks = await pool.query('SELECT * FROM tasks WHERE created_by = ($1);', [username]);

        return res.status(200).json({ "tasks": tasks.rowCount === 0 ? 0 : tasks.rows });
    } catch (error) {
        console.log('error occurred while reading tasks by username:', error);
        return res.status(500).json(error);
    }
}

const getOneTaskByIdAndUsername = async (req: Request, res: Response) => {
    const { id, username } = req.params;
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    try {
        const pool = getPool(database);

        const foundOneTask = await pool.query(`SELECT * FROM tasks WHERE id = ($1) AND created_by = ($2)`, [id, username])

        if (!foundOneTask.rows || foundOneTask.rows.length === 0) {
            return res.status(404).json({ 'message': `task by id ${id} not found` });
        }

        return res.status(200).json(foundOneTask.rows[0]);
    } catch (error) {
        console.log('error occurred while reading tasks by username:', error);
        return res.status(500).json(error);
    }
}

const createTask = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    if (Object.values(req.body).length === 0) {
        return res.status(400).json({ 'message': 'body of your request is empty' });
    }

    const { title, description, priority, status, created_by } = req.body;

    try {
        const pool = getPool(database);

        const newTask = await pool.query('INSERT INTO tasks (title, description, priority, status, created_by) VALUES ($1, $2, $3, $4, $5);', [title, description, priority, status, created_by]);

        return res.status(200).json({ 'message': newTask.rowCount === 0 ? 0 : newTask.rowCount });
    } catch (error) {
        console.log('error occurred while creating task:', error);
        return res.status(500).json(error);
    }
}

const updateTaskByIdAndUsername = async (req: Request, res: Response) => {
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    if (Object.values(req.body).length === 0) {
        return res.status(400).json({ 'message': 'body of your request is empty' });
    }

    const { id, title, description, priority, status, created_by } = req.body;

    try {
        const pool = getPool(database);

        const editedTask = await pool.query('UPDATE tasks SET title = ($1), description = ($2), priority = ($3), status = ($4) WHERE id = ($5) AND created_by = ($6) RETURNING *;', [title, description, priority, status, id, created_by]);

        if (editedTask.rowCount === 0) {
            return res.status(404).json({ 'message': 'task not found to be updated' });
        }

        return res.status(200).json({ 'UPDATED TASK': editedTask.rows[0] });
    } catch (error) {
        console.log('error occurred while updating task:', error);
        return res.status(500).json(error);
    }
}

const deleteTaskById = async (req: Request, res: Response) => {
    const { id, username } = req.params
    const database = process.env.SUPABASE_PG_DB as string;
    await pgConn(database);

    try {
        const pool = getPool(database);

        const taskToDelete = await pool.query('DELETE FROM tasks WHERE id = ($1) AND created_by = ($2);', [id, username])

        if (taskToDelete.rowCount === 0) {
            return res.status(404).json({ 'message': `task by id ${id} not found for furthel deletion` });
        }

        return res.status(200).json({ 'message': 'task deleted' });
    } catch (error) {
        console.log('error occurred while task deletion:', error);
        return res.status(500).json(error);
    }
}

export {
    getTasks,
    getTasksByUsername,
    getOneTaskByIdAndUsername,
    createTask,
    updateTaskByIdAndUsername,
    deleteTaskById,
}