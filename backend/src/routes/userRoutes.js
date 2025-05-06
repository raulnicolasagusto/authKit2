import express from 'express';
import { 
  loginUser, 
  logoutUser, 
  getUser, 
  registerUser, 
  updateUser, 
  userLoginStatus, 
  verifyEmail,
  forgotPassword, 
  resetPassword,
  uploadPhoto
} from '../controllers/auth/userController.js';
import { protect, adminMiddleware, creatorMiddleware } from '../middleware/authMiddleware.js';
import { deleteUser, getAllUsers } from '../controllers/auth/adminController.js';
import { testEmail } from "../controllers/auth/emailController.js";

const router = express.Router();

// Rutas públicas
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Rutas protegidas (requieren autenticación)
router.get("/logout", protect, logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);
router.patch("/user/photo", protect, uploadPhoto);
router.get("/login_status", protect, userLoginStatus);
router.post("/verify-email", protect, testEmail);

// Rutas de administración
router.get("/users", protect, adminMiddleware, getAllUsers); // Para admins
router.get("/creator/users", protect, creatorMiddleware, getAllUsers); // Para creators
router.delete("/users/:id", protect, adminMiddleware, deleteUser); // Solo admins pueden eliminar

export default router;