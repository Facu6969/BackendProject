import UserService from "../services/user.service.js"

class UserController {
    async register(req, res) {
        try {
            const { newUser, token } = await UserService.registerUser(req.body);
            res.status(201).send({ message: "Usuario creado con éxito", token, user: newUser });
        } catch (error) {
            console.error("Error en la creación del usuario:", error);
            res.status(400).send(error.message);
        }
    }

    async login(req, res) {
        try {
            const { success, token, message } = await UserService.loginUser(req.body.email, req.body.password);
            if (!success) {
                // Si las credenciales no son válidas, envía un mensaje claro
                return res.status(401).send(message);
            }

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 86400000,
            }).send({ message: 'Login correcto', token });
        } catch (error) {
            console.error("Error al logear usuario:", error);
            res.status(500).send("Error en el servidor");
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

            console.log('Token en current:', token);

            const user = await UserService.getCurrentUser(token);

            console.log('Usuario en current:', user);

            res.status(200).json({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
              });
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