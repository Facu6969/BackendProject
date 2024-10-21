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
}

export default new UserDAO();
