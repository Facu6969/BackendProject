import dotenv from "dotenv";
dotenv.config({ path: '../src/.env' });
import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserService from "../services/user.service.js";
import { createHash, isValidPassword } from "../utils/util.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    // Estrategia de Registro Local
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            // Usamos el servicio para el registro
            const userData = { first_name, last_name, email, password: createHash(password), age, role: 'user' };
            const { newUser } = await UserService.registerUser(userData); // Servicio de registro
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }));

     // Estrategia de Login Local
     passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserService.getUserByEmail(email);
            if (!user || !isValidPassword(password, user)) {
                return done(null, false, { message: "Credenciales inválidas" });
            }

            const token = generateToken({
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            });

            return done(null, { user, token });
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserService.getUserById(id); // Usamos el servicio para encontrar el usuario
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

    passport.use("github", new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
 
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("profile:", profile);
        try {
            let email = profile._json.email || `${profile.username}@github.com`;
            const userData = {
                first_name: profile._json.name || 'Usuario',
                last_name: profile._json.last_name || '',
                email,
                age: profile._json.age || null,
                password: ""
            };

            // Buscar o crear el usuario usando el servicio
            const user = await UserService.findOrCreateGitHubUser(userData); 
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}

export default initializePassport;
