import UserDAO from "../dao/user.dao.js";

class UserRepository {
    async createUser(userDTO) {
        return await UserDAO.createUser(userDTO);
    }

    async findUserByEmail(email) {
        return await UserDAO.findUserByEmail(email);
    }

    async findUserById(id) {
        return await UserDAO.findUserById(id);
    }
}

export default new UserRepository();
