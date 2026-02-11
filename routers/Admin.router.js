import express from "express";
import { createAdmin, deleteUser, getAllUsers, loginAdmin, logoutAdmin, updateUser } from "../controllers/Admin.controller.js";
import authMiddleware from "../middleware/access.js";
 




const router = express.Router();
router.post('/login', loginAdmin);
router.post("/register",createAdmin);
router.get("/users",  getAllUsers);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post('/logout', logoutAdmin )



export default router;
