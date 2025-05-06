import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No autorizado, por favor inicia sesión" });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Obtener usuario y verificar versión del token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Verificar versión del token
    if (user.tokenVersion !== decoded.version) {
      return res.status(401).json({ message: "Sesión expirada, por favor inicia sesión nuevamente" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ 
      message: error.message === "jwt expired" 
        ? "Sesión expirada" 
        : "Error de autenticación" 
    });
  }
});



// ADMIN MIDDLEWARE

export const adminMiddleware = asyncHandler(async (req, res, next) => {
     // check if user is admin
    if (req.user && req.user.role === "admin") {      
        //if user is admin, move to the next middleware/controller 
        next();
        return;
    }
    // if user is not admin, send error response
    res.status(401).json({ message: "No autorizado, no tienes permisos de administrador" });
    return;
});

//CREATOR MIDDLEWARE

export const creatorMiddleware = asyncHandler(async(req, res, next)=>{
    if(req.user && req.user.role === "creator" || req.user && req.user.role === "admin"){
        //if user is creator, move to the next middleware/controller
        next();
        return;
    }
    res.status(401).json({ message: "No autorizado, no tienes permisos de creador" });
});

//verify middleware

export const verifyMiddleware = asyncHandler(async(req, res, next)=>{
    // check if user is creator or admin
    if(req.user && req.user.isVerified === true){
        //if user is creator, move to the next middleware/controller
        next();
        return;
    }
    // if user is not creator or admin, send error response
    res.status(401).json({ message: "No autorizado, no tienes permisos de creador o administrador",  });
    return;
} )