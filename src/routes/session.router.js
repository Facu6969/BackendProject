import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get('/verify/:verificationToken', UserController.verifyUser);

router.get('/logout', authMiddleware(['user', 'admin']), UserController.logout);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), UserController.githubCallback);

router.get('/current', authMiddleware(['user', 'admin']), UserController.current);

export default router;
