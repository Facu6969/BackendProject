import UserRepository from "../repositories/user.repository.js";
import CreateUserDTO from "../dto/user.dto.js";
import { createHash, isValidPassword } from "../utils/util.js";
import { generateToken, verifyToken } from '../utils/jsonwebtoken.js';
import EmailService from "./email.service.js";
import { v4 as uuidv4 } from 'uuid';

class UserService {
    async registerUser(userData) {
        const { first_name, last_name, email, password, age, role } = userData;

        const existingUser = await UserRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("El correo ya está registrado");
        }

        const hashedPassword = createHash(password);
        const verificationToken = uuidv4();
        const userDTO = new CreateUserDTO({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            age,
            role: role || 'user',
            isVerified: false,
            verificationToken
        });

        const newUser = await UserRepository.createUser(userDTO);
        await EmailService.sendVerificationEmail(email, verificationToken);

        const token = generateToken({
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            role: newUser.role
        });

        return { newUser, token };
    }

    async verifyUser(verificationToken) {
        const user = await UserRepository.findByVerificationToken(verificationToken);

        if (!user) {
            throw new Error("Token de verificación inválido o expirado.");
        }

        return await UserRepository.verifyUser(user._id);
    }

    async loginUser(email, password) {
        const user = await UserRepository.findUserByEmail(email);
        if (!user) return { success: false, message: "Usuario no encontrado" };

        if (!user.isVerified) {
            return { success: false, message: "Debes verificar tu cuenta para poder iniciar sesión" };
        }

        if (!isValidPassword(password, user)) {
            return { success: false, message: "Credenciales inválidas" };
        }

        const token = generateToken({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        });

        return { success: true, token }; // Devuelve el token si todo es correcto
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
