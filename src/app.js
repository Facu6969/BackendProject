import dotenv from "dotenv";
dotenv.config({ path: './src/.env' });
import express from "express";
import { engine } from "express-handlebars";
import { createServer } from "http";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import passport from "passport";
import productsRouter from "./routes/products.router.js"; 
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import connectDB from "./db.js";
import setupSocket from "./socket.js"
import initializePassport from "./config/passport.config.js";


const app = express();
const server = createServer(app); // Crear un servidor HTTP
const PUERTO = process.env.PORT;

// Conectar a MongoDB
connectDB();

// Config Handlebars
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl : 100,
    })
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/sessions", sessionRouter);
app.use("/api/products", productsRouter); // Usar el router de productos
app.use("/api/carts", cartsRouter); // Usar el router de carrito
app.use("/", viewsRouter);

// Configurar la conexión de Socket.io
setupSocket(server);

//LISTEN
server.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);

})


