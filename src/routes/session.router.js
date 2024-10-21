import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";

const router = Router();

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get('/logout', UserController.logout);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), UserController.githubCallback);

// Ruta protegida usando el middleware de autenticación
router.get('/current', UserController.current);

export default router;
