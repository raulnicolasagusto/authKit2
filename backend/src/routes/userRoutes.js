import express from 'express';
import { loginUser, logoutUser, getUser, registerUser, updateUser, userLoginStatus } from '../controllers/auth/userController.js';
import { protect,adminMiddleware, creatorMiddleware } from '../middleware/authMiddleware.js';
import { deleteUser, getAllUsers } from '../controllers/auth/adminController.js';

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser);
router.get("/logout", logoutUser);
// incluimos el middleware en la autenticacion , ya que no debemos estar registrados para ingresar a la ruta de perfil
router.get("/user",protect, getUser);
router.patch("/user",protect, updateUser);

//admin routes, a agregamos un middleware mas para el admin, ya que este puede eliminar usuarios
router.delete("/admin/users/:id",protect, adminMiddleware, deleteUser);

//get all users
router.get("/admin/users/creator", protect, creatorMiddleware, getAllUsers);

//Loguin status
router.get("/login_status", userLoginStatus);




export default router;