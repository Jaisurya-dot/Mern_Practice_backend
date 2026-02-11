import express from "express";
import { createAdmin, deleteUser, getAllUsers, loginAdmin, logoutAdmin, updateUser } from "../controllers/Admin.controller.js";
import authMiddleware from "../middleware/access.js";
 




const router = express.Router();
router.post('/login', loginAdmin);
router.post("/register",createAdmin);
router.get("/users",  getAllUsers);
router.put("/:id", updateUser);  //authMiddleware,
router.delete("/:id",  deleteUser);  // authMiddleware,
router.post('/logout', logoutAdmin )



export default router;
