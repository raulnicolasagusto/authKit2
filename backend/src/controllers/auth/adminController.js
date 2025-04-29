import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";

export const deleteUser = asyncHandler(async (req, res) => {
    // extract user ID from the request parameters
    const {id} = req.params;
    const name = req.user.name;
    
   try {
     // attempt to find and delete the user
     const user = await User.findByIdAndDelete(id);
     //check if user exist
     
     if (!user) {
         return res.status(404).json({ message: "Usuario no encontrado" });
     }
 
     //delete user
     res.status(200).json({
         message: "Usuario eliminado con exito",
     });
    

   } catch (error) {
         // handle any errors that occur during the process
         res.status(500).json({ message: "Error al eliminar el usuario"});
         return;
   }
})


// get all users

export const getAllUsers = asyncHandler(async (req, res) => {
    const user = await User.find({});

    try {
        if (!user){
            return res.status(404).json({ message: "No se encontraron usuarios" });
        }
    
        res.status(200).json({
            name: req.user.name,
            role: req.user.role,
            message:" has requested all users",
           
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios" });
        return;
    }

    

})
