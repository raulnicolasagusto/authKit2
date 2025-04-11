import express from 'express';
import { loginUser, logoutUser, getUser, registerUser, updateUser } from '../controllers/auth/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser);
router.get("/logout", logoutUser);
// incluimos el middleware en la autenticacion , ya que no debemos estar registrados para ingresar a la ruta de perfil
router.get("/user",protect, getUser);
router.patch("/user",protect, updateUser);


export default router;