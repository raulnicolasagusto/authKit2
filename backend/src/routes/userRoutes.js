import express from 'express';
import { registerUser } from '../controllers/auth/userController.js';
import { loginUser } from '../controllers/auth/userController.js';

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser);


export default router;