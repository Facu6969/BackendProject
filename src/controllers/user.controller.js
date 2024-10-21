import UserService from "../services/user.service.js"

class UserController {
    async register(req, res) {
        try {
            const { newUser, token } = await UserService.registerUser(req.body);
            res.status(201).send({ message: "Usuario creado con éxito", token });
        } catch (error) {
            console.error("Error en la creación del usuario:", error);
            res.status(400).send(error.message);
        }
    }

    async login(req, res) {
        try {
            const { user, token } = await UserService.loginUser(req.body.email, req.body.password);
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 86400000,
            }).send({ message: 'Login correcto', token });
        } catch (error) {
            console.error("Error al logear usuario:", error);
            res.status(401).send(error.message);
        }
    }

    async githubCallback(req, res) {
        try {
            req.session.user = req.user;
            req.session.login = true;
            res.redirect("/products");
        } catch (error) {
            res.status(500).send("Error al iniciar sesión con GitHub");
        }
    }

    async current(req, res) {
        try {
            const token = req.cookies.token;
            const user = await UserService.getCurrentUser(token);
            res.status(200).send(user);
        } catch (error) {
            res.status(401).send("No se pudo obtener el usuario");
        }
    }

    async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) return res.status(500).send("Error al cerrar la sesión");
                res.clearCookie("token").redirect("/login");
            });
        } catch (error) {
            res.status(500).send("Error al cerrar la sesión");
        }
    }
}

export default new UserController();