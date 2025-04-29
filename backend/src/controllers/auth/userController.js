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

//email verification
export const verifyEmail = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404).json({message:"Usuario no encontrado"});
    }

    //check if user is already verified

    if (user.isVerified) {
        res.status(400).json({message:"El usuario ya esta verificado"});
    }

    let token = await Token.findOne({ userId: user._id });

    //if token exists, delete de token 
    if (token) {
        await token.deleteOne({ userId: user._id });
        
    }

    //create a verification token using crypto
    const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;
    //hash the verification token
    const hashedToken = await hashToken(verificationToken);

    await new Token({
        userId: user._id,
        verificationToken: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hs
    }).save();

    //verification link
    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    //send email to user with the verification link
    const subject = "Verifica tu cuenta de usuario - AuthKit";
    const send_to = user.email;
    const reply_to = "noreply@gmail.com";
    const template = "emailVerification";
    const send_from = process.env.USER_EMAIL;
    const name = user.name;
    const link = verificationLink;

//     try {
//         await sendEmail(subject, send_to, send_from, reply_to, template, name, link);

//         res.status(200).json({message:"Email de verificacion enviado"});


//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message:"Error al enviar el correo de verificacion"});
//     }

// })

await sendEmail(
    newUser.email,
    "Confirma tu cuenta",
    `<p>Hola ${newUser.name}, hacé clic en el siguiente enlace para confirmar tu cuenta.</p>`
  );

})


//A continuacion, configuracion de envio de emails gracias a Deepseek





// 1. Solicitud de restablecimiento
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    // Busca al usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  
    // Genera un token temporal (válido por 1 hora)
    const resetToken = generateToken(user._id, "1h");
    user.passwordResetToken = resetToken;
    await user.save();
  
    // Enlace para restablecer (ajusta la URL de tu frontend)
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  
    // Plantilla del correo
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Restablecer contraseña</h2>
        <p>Haz clic en el botón para continuar:</p>
        <a href="${resetUrl}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Restablecer contraseña
        </a>
        <p style="margin-top: 20px; color: #888;">
          Si no solicitaste esto, ignora este correo. El enlace expira en 1 hora.
        </p>
      </div>
    `;
  
    // Envía el correo
    await sendEmail(email, "Restablece tu contraseña en AuthKit", html);
    res.status(200).json({ message: "Correo enviado con éxito" });
  };
  
  // 2. Procesar el restablecimiento
  export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    // Verifica el token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }
  
    // Busca al usuario con el token
    const user = await User.findOne({ 
      _id: decoded.id, 
      passwordResetToken: token 
    });
    if (!user) {
      return res.status(400).json({ message: "Token no válido" });
    }
  
    // Actualiza la contraseña y limpia el token
    user.password = newPassword;
    user.passwordResetToken = undefined;
    await user.save();
  
    res.status(200).json({ message: "Contraseña actualizada con éxito" });
  };