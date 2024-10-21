import UserRepository from "../repositories/user.repository.js";
import CreateUserDTO from "../dto/user.dto.js";
import { createHash, isValidPassword } from "../utils/util.js";
import { generateToken, verifyToken } from '../utils/jsonwebtoken.js';

class UserService {
    async registerUser(userData) {
        const { first_name, last_name, email, password, age, role } = userData;

        const existingUser = await UserRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("El correo ya está registrado");
        }

        const hashedPassword = createHash(password);
        const userDTO = new CreateUserDTO({ 
            first_name, 
            last_name, 
            email, 
            password: hashedPassword, 
            age, 
            role: role || 'user' 
        });

        const newUser = await UserRepository.createUser(userDTO);
        const token = generateToken({
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            role: newUser.role
        });

        return { newUser, token };
    }

    async loginUser(email, password) {
        const user = await UserRepository.findUserByEmail(email);
        if (!user || !isValidPassword(password, user)) {
            throw new Error("Credenciales inválidas");
        }

        const token = generateToken({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        });

        return { user, token };
    }

    async getCurrentUser(token) {
        const userData = verifyToken(token);
        if (!userData) {
            throw new Error("Token inválido o expirado");
        }
        return userData;
    }
}

export default new UserService();
