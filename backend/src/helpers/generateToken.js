import jwt from 'jsonwebtoken';

//use user id to generate token

const generateToken = (id) => {
    //token most be return
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};


export default generateToken;