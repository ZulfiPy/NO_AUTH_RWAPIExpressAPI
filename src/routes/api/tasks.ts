import express from "express";
import { getTasks, getOneTaskByIdAndUsername, getTasksByUsername, createTask, updateTaskByIdAndUsername, deleteTaskById } from "../../controllers/tasksController";

const router = express.Router();

// /api/tasks routes
router.get('/', getTasks);
router.get('/:username', getTasksByUsername);
router.get('/:username/:id', getOneTaskByIdAndUsername);
router.post('/', createTask);
router.put('/', updateTaskByIdAndUsername);
router.delete('/:username/:id', deleteTaskById);

export default router;