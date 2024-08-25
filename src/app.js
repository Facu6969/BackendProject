import express from "express";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js"; 
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import mongoose from "mongoose";

const app = express();
const server = createServer(app); // Crear un servidor HTTP
const io = new Server(server); // Crear una instancia de socket.io con el servidor HTTP
const PUERTO = 8080;

// Config Handlebars
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'



app.use("/api/products", productsRouter); // Usar el router de productos
app.use("/api/carts", cartsRouter); // Usar el router de carrito
app.use("/", viewsRouter);

//conectamos con mongoDB Atlas
mongoose.connect("mongodb+srv://FacuBackend:facundo@cluster0.1otn2.mongodb.net/Backend01?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("conectado a mongoDB"))
    .catch((err) => console.log("no conecto, revisa el codigo", err));



// Configurar la conexión de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejar el nuevo producto desde el formulario en tiempo real
    socket.on('newProduct', async (productData) => {
        await ProductModel.create(productData); // Usar Mongoose para agregar producto a MongoDB
        const productosActualizados = await ProductModel.find();
        io.emit('productUpdated', productosActualizados);
        console.log('Evento productUpdated emitido', productosActualizados);
    });
});

//LISTEN

server.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);

})


