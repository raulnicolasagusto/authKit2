import asyncHandler  from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.js";

export const protect = asyncHandler(async (req, res, next) => {
    try {
        // check if user is logged in
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No autorizado, por favor logueate" });
        }
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // get the user from the token
        const user = await User.findById(decoded.id).select("-password");
        //check if user exist
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }
        //set user details in the request object
        req.user = user;
        //call the next middleware function
        next();
    } catch (error) {
        
    }
})


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