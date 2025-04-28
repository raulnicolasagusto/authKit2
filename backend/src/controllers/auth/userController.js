import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";
import generateToken from "../../helpers/generateToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// USER REGISTER
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

    //generate token with user id
    const token = generateToken(user._id);
    //set cookie with token
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
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
            token,

            
        });
    }else{
        res.status(400).json({message:"Error al crear el usuario"});
    }

});

//USER LOGIN

export const loginUser = asyncHandler(async (req, res) => {
    // get email and password from req.body
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
        //400 bad request 
        res.status(400).json({message:"Todos los campos son requeridos"});
        }
    //check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
        res.status(400).json({message:"El usuario no existe, create un usario para acceder!"});
    }

    //check if password match the user password
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
        console.log(password, userExist.password);
        console.log(isMatch);
        res.status(400).json({message:"Contraseña incorrecta"});
    }

    //generate token with user id
    const token = generateToken(userExist._id);
    if (userExist && isMatch) {
        const { _id, name, email, role, photo, bio, isVerified } = userExist;
        //set cookie with token
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
            sameSite: true,
            secure: true,
        });

        //201 created
        res.status(200).json({
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
        res.status(400).json({message:"Error al iniciar sesión"});
    }
    
});


//Logout user

export const logoutUser = asyncHandler(async(req, res) => {
    res.clearCookie("token");
    res.status(200).json({message:"Usuario deslogueado exitosamente"});

})


//GET USER

export const getUser = asyncHandler(async(req, res) => {
    // get user details from the token--> explude password
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
        res.status(200).json({message:"Usuario logueado", user: req.user});
    } else {
        res.status(404).json({message:"Error al obtener el usuario"});
    }
    

})

//UPDATE USER

export const updateUser = asyncHandler(async(req, res) => {
    //GET USER DETAILS FROM THE TOKEN --> USING MIDDLEWARE
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404).json({message:"Usuario no encontrado"});
    }

    if (user){
        const { name, bio, photo } = req.body;
        //update user details
        user.name = name || user.name;
        user.bio = req.body.bio || user.bio;
        user.photo = photo || user.photo;

        //save user
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            bio: updatedUser.bio,
            isVerified: updatedUser.isVerified,
            // token: generateToken(updatedUser._id),
        });
    }


})

//USER LOGIN STATUS, nos dice con true o false si el usuario esta logueado o no
export const userLoginStatus = asyncHandler(async(req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No autorizado, por favor logueate" });
    }
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
     res.status(200).json(true);
    }else{
        res.status(401).json(false);
    }

});  