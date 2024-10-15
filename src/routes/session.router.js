import { Router } from "express";
import passport from "passport";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/util.js";
import { generateToken, verifyToken } from '../utils/jsonwebtoken.js'; 

const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        const existeUsuario = await UserModel.findOne({ email });

        if (existeUsuario) {
            return res.status(400).send("El correo ya existe");
        }

        const nuevoUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            role: role || 'user'
        });

        const token = generateToken({
            first_name: nuevoUser.first_name,
            last_name: nuevoUser.last_name,
            email: nuevoUser.email,
        });

        res.status(201).send({ message: "Usuario creado con éxito", token });
    } catch (error) {
        console.error("Error en la creación del usuario:", error);
        res.status(500).send("Error del servidor");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const usuario = await UserModel.findOne({ email });

        if (!usuario || !isValidPassword(password, usuario)) {
            return res.status(401).send('Credenciales inválidas');
          }

        const token = generateToken({
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
        });

        // Envía la cookie `token` con el JWT
        res.cookie('token', token, {
            httpOnly: true, // Solo accesible desde el servidor
            sameSite: 'strict', // Evitar CSRF
            secure: false, // Cambia a true si usas HTTPS
            maxAge: 86400000,
            }).send({ message: 'Login correcto', token });
    
    } catch (error) {
        console.error("Error al logear usuario:", error);
        res.status(500).send("Error del servidor");
    }
});

router.get('/logout', async (req, res) => {
    try {
      // Convertir req.session.destroy() en una promesa
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) reject(err); // Rechazar la promesa si hay error
          resolve(); // Resolver si todo está bien
        });
      });
  
      // Limpiar las cookies
      res.clearCookie('token');
      res.clearCookie('connect.sid'); // Opcional, si usas express-session
  
      // Redirigir al login
      res.redirect('/login');
    } catch (error) {
      console.error('Error al cerrar la sesión:', error.message);
      res.status(500).send('Error al cerrar la sesión');
    }
  });
  
  

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
      try {
        // Usar async/await para manejar la sesión de forma asíncrona
        await new Promise((resolve, reject) => {
          req.session.regenerate((err) => {
            if (err) return reject(err); // Rechazar si hay error
            req.session.user = req.user; // Guardar el usuario en la sesión
            req.session.login = true; // Marcar la sesión como iniciada
            resolve(); // Resolver la promesa si todo está bien
          });
        });
  
        // Redirigir al catálogo de productos
        res.redirect("/products");
      } catch (error) {
        console.error("Error al gestionar la sesión con GitHub:", error.message);
        res.status(500).send("Error al iniciar sesión con GitHub");
      }
    }
  );
  

// Ruta protegida usando el middleware de autenticación
router.get('/current', (req, res) => {
    try {
      const token = req.cookies.token; // Leer el token desde las cookies
  
      if (!token) {
        return res.status(401).json({ message: 'No se proporcionó un token' });
      }
  
      const user = verifyToken(token); // Verificar el token
  
      if (!user) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
      }
  
      // Devolver los datos del usuario
      res.json({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al validar el usuario actual', error: error.message });
    }
  });

export default router;
