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
         res.status(500).json({ message: "Error al eliminar el usuario", name, id });
         return;
   }
})
