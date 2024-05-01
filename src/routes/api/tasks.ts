import express from "express";
import { getTasks, getOneTaskById, getTasksByUsername, createTask, updateTaskById, deleteTaskById } from "../../controllers/tasksController";

const router = express.Router();

// /api/tasks route protected with custom isAuthorized function 
router.get('/', getTasks);
router.get('/:username', getTasksByUsername);
router.get('/:username/:id', getOneTaskById);
router.post('/', createTask);
router.put('/', updateTaskById);
router.delete('/', deleteTaskById);

export default router;