import dotenv from "dotenv";
dotenv.config({ path: '../src/.env' });
import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/util.js";
import { generateToken } from "../utils/jsonwebtoken.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            let user = await UserModel.findOne({ email: email });
            if (user) return done(null, false);
            
            let nuevoUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            };
            let result = await UserModel.create(nuevoUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: "Usuario no encontrado." });
            }
            if (!isValidPassword(password, user)) 
                return done(null, false, { message: "Contraseña incorrecta." });

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
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    });

    passport.use("github", new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
 
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("profile:", profile);

        try {
            let email = profile._json.email || `${profile.username}@github.com`;
            let user = await UserModel.findOne({ email });

            if (!user) {
                let newUser = {
                    first_name: profile._json.name || 'Usuario',
                    email,
                    password: "",
                    ...(profile._json.last_name ? { last_name: profile._json.last_name } : {}),
                    ...(profile._json.age ? { age: profile._json.age } : {})
                };
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
}

export default initializePassport;
