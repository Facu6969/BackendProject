import UserModel from "./models/user.model.js";

class UserDAO {
    async createUser(userData) {
        return await UserModel.create(userData);
    }

    async findUserByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async findUserById(id) {
        return await UserModel.findById(id);
    }

    // Método para buscar por token de verificación
    async findByVerificationToken(verificationToken) {
        return await UserModel.findOne({ verificationToken });
    }

    // Método para actualizar la verificación del usuario
    async verifyUser(id) {
        return await UserModel.findByIdAndUpdate(
            id,
            { isVerified: true, verificationToken: null },
            { new: true }
        );
    }
}

export default new UserDAO();
