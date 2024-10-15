import jwt from "jsonwebtoken";

const private_key = "palabrasecretaparatoken";

const generateToken = (user) => {
    const token = jwt.sign(user, private_key, {expiresIn: "24h"});
    return token;
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, private_key);
    } catch (error) {
        return null; 
    }
};

export { generateToken, verifyToken };