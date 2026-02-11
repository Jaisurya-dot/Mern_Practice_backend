import express from "express";
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser
} from "../controllers/User.controller.js";

const router = express.Router();

// Get all users
router.get("/", getAllUsers);

// Create a new user
router.post("/", createUser);

// Get user by ID
router.get("/:id", getUserById);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

export default router;