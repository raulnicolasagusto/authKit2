import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Por favor ingrese su nombre"],
    },

    email: {
        type: String,
        required: [true, "Por favor ingrese su correo electronico"],
        unique: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
            "Por favor ingrese un correo electronico valido",
        ],
    },

    password: {
        type: String,
        required: [true, "Por favor ingrese su contraseña"],
    },

    photo:{
        type: String,
        default: "no-photo.jpg",
    },

    bio:{
        type: String,
        default: "Hola, soy nuevo aqui",
    },

    role:{
        type: String,
        enum: ["user", "admin", "creator"],
        default: "user",

    }, isVerified:{
        type: Boolean,
        default: false,
    },

}, { timestamps: true, minimize: true });   

// encrypt password before saving to database ( hash )

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();

    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(this.password, salt);
    //set the password to the hashed password
    this.password = hashedPassword;
    //call the next middleware function
    next(); 
    


})

const User = mongoose.model("User", UserSchema);

export default User;


//min 1:11:27