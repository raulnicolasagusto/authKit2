import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    //validation
    if (!name || !email || !password) {
        //400 bad request 
        res.status(400).json({message:"Todos los campos son requeridos"});
        }

    if (password.length < 6) {
        return res
        .status(400)
        .json({message:"La contraseña debe tener al menos 6 caracteres"});
    }   
    
    //check if user already exist

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({message:"El usuario ya existe"});
    }

    //create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if(user) {
        const { _id, name, email, role, photo, bio, isVerified } = user;
        //201 created
        res.status(201).json({
            _id,
            name,
            email,
            role,
            photo,
            bio,
            isVerified,

            
        });
    }else{
        res.status(400).json({message:"Error al crear el usuario"});
    }

});