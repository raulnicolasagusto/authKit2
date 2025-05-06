import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import generateToken from "../../helpers/generateToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../../models/auth/Token.js";
import crypto from "node:crypto";
import hashToken from "../../helpers/hashToken.js";
import sendEmail from "../../helpers/sendEmail.js";

// USER REGISTER
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son requeridos"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "La contraseña debe tener al menos 6 caracteres"
        });
    }   
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: "El usuario ya existe"
        });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate token
    const token = generateToken(user._id);
    
    // Set cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    if (user) {
        const { _id, name, email, role, photo, bio, isVerified } = user;
        
        res.status(201).json({
            success: true,
            _id,
            name,
            email,
            role,
            photo,
            bio,
            isVerified,
            token,
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Error al crear el usuario"
        });
    }
});

// USER LOGIN
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }
  
    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }
  
    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }
  
    // Generar token (sin versionado para login inicial)
    const token = generateToken(user._id);
  
    // Configurar cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    });
  
    // Respuesta exitosa
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
      isVerified: user.isVerified
    });
  });

// LOGOUT USER
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({
        success: true,
        message: "Usuario deslogueado exitosamente"
    });
});

// GET USER
export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Usuario no encontrado"
        });
    }

    res.status(200).json({
        success: true,
        user
    });
});

// UPDATE USER
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
  
    // Manejo especial para cambio de contraseña
    // Manejo especial para cambio de contraseña
// Manejo especial para cambio de contraseña
if (req.body.newPassword) {
    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual es incorrecta"
      });
    }
  
    // Validar nueva contraseña
    if (req.body.newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe tener al menos 6 caracteres"
      });
    }
  
    try {
      // Asignar contraseña directamente (usará el pre-save hook para hashing)
      user.password = req.body.newPassword;
      
      // Guardar desactivando validaciones adicionales
      await user.save({ validateBeforeSave: false });
  
      // Verificación de debug
      console.log('Nuevo hash almacenado:', user.password);
      
      // Limpiar todas las cookies de sesión
      res.clearCookie('token');
      res.clearCookie('session');
  
      // Respuesta con indicación de logout requerido
      return res.status(200).json({
        success: true,
        message: "Contraseña actualizada correctamente. Serás redirigido para iniciar sesión nuevamente.",
        requiresLogout: true,
        timestamp: Date.now()
      });
  
    } catch (saveError) {
      console.error('Error crítico al guardar contraseña:', saveError);
      return res.status(500).json({
        success: false,
        message: "Error interno al actualizar la contraseña",
        error: saveError.message
      });
    }
  }
  
    // Actualizar otros campos (no contraseña)
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.photo = req.body.photo || user.photo;
  
    const updatedUser = await user.save();
    
    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photo: updatedUser.photo,
        bio: updatedUser.bio,
        isVerified: updatedUser.isVerified,
      }
    });
  });

// UPLOAD PHOTO
export const uploadPhoto = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Usuario no encontrado"
        });
    }

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No se ha subido ninguna imagen"
        });
    }

    user.photo = req.file.path;
    await user.save();
    
    res.status(200).json({
        success: true,
        message: "Foto actualizada correctamente",
        photo: user.photo
    });
});

// USER LOGIN STATUS
export const userLoginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json(false);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json(!!decoded);
    } catch (error) {
        res.json(false);
    }
});

// VERIFY EMAIL
export const verifyEmail = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Usuario no encontrado"
        });
    }

    if (user.isVerified) {
        return res.status(400).json({
            success: false,
            message: "El usuario ya está verificado"
        });
    }

    // Delete existing token if exists
    await Token.findOneAndDelete({ userId: user._id });

    // Create verification token
    const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;
    const hashedToken = await hashToken(verificationToken);

    await new Token({
        userId: user._id,
        verificationToken: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }).save();

    // Verification link
    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send email
    try {
        await sendEmail(
            user.email,
            "Confirma tu cuenta",
            `<p>Hola ${user.name}, haz clic en el siguiente enlace para confirmar tu cuenta: <a href="${verificationLink}">Verificar cuenta</a></p>`
        );

        res.status(200).json({
            success: true,
            message: "Email de verificación enviado"
        });
    } catch (error) {
        console.error("Error sending verification email:", error);
        res.status(500).json({
            success: false,
            message: "Error al enviar el correo de verificación"
        });
    }
});

// FORGOT PASSWORD
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Usuario no encontrado"
        });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = generateToken(user._id, "1h");
    user.passwordResetToken = resetToken;
    await user.save();

    // Reset link
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Send email
    try {
        await sendEmail(
            user.email,
            "Restablece tu contraseña",
            `<p>Hola ${user.name}, haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetUrl}">Restablecer contraseña</a></p>`
        );

        res.status(200).json({
            success: true,
            message: "Correo para restablecer contraseña enviado"
        });
    } catch (error) {
        console.error("Error sending reset email:", error);
        res.status(500).json({
            success: false,
            message: "Error al enviar el correo para restablecer contraseña"
        });
    }
});

// RESET PASSWORD
export const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Token y nueva contraseña son requeridos"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ 
            _id: decoded.id, 
            passwordResetToken: token 
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Token inválido o expirado"
            });
        }

        user.password = newPassword;
        user.passwordResetToken = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Contraseña actualizada con éxito"
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(400).json({
            success: false,
            message: "Token inválido o expirado"
        });
    }
});