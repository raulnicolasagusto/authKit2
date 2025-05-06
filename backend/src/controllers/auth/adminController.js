import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        // Prevent self-deletion
        if (id === req.user._id.toString()) {
            return res.status(400).json({ 
                success: false,
                message: "No puedes eliminarte a ti mismo" 
            });
        }

        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "Usuario no encontrado" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Usuario eliminado con éxito",
            deletedUser: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al eliminar el usuario",
            error: error.message 
        });
    }
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}).select('-password -__v');
        
        if (!users || users.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No se encontraron usuarios" 
            });
        }
    
        res.status(200).json({
            success: true,
            count: users.length,
            users: users.map(user => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                photo: user.photo,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }))
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al obtener los usuarios",
            error: error.message 
        });
    }
});