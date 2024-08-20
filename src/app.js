import express from "express";
import ProductManager  from "./controllers/product-manager.js";
import CartManager from "./controllers/cart-manager.js";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app); // Crear un servidor HTTP
const io = new Server(server); // Crear una instancia de socket.io con el servidor HTTP
const PUERTO =8080;

//config Handlebars
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'

// importar el  productManager y cartManager
const productManager = new ProductManager("./src/data/productos.json");
const cartManager = new CartManager("./src/data/carrito.json");


//RUTA raiz
app.get("/", async (req, res) => {
    const productos = await productManager.getProducts();
    res.render("home", { products: productos });
});

// RUTA para la vista real-time products con Socket.io
app.get("/realtimeproducts", async (req, res) => {
    const productos = await productManager.getProducts();
    res.render("realTimeProducts", { products: productos });
});

//RUTA /products

app.get("/api/products", async (req, res) => {
    const limit = parseInt(req.query.limit); //limitar la cantidad de productos devueltos
    const arrayProductos = await productManager.getProducts();
    
    if (!isNaN(limit) && limit > 0) {
        res.status(200).send(arrayProductos.slice(0, limit));
    } else {
        res.status(200).send(arrayProductos);
    }
});

//RUTA /products:id

app.get("/api/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const producto = await productManager.getProductById(parseInt(id));
    if (!producto) {
        res.status(404).send("No se encuentra el producto");
    } else {
        res.status(200).send(producto);
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const nuevoProducto = req.body;
        await productManager.addProduct(nuevoProducto);
        console.log(nuevoProducto);
        const productosActualizados = await productManager.getProducts();
        io.emit('productUpdated', productosActualizados); // Emitimos el evento de actualización
        res.status(201).send("Producto agregado");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.put("/api/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;
    const resultado = await productManager.updateProduct(parseInt(id), productoActualizado);
    if (resultado) {
        io.emit('productUpdated', await productManager.getProducts());
        res.status(200).send("Producto actualizado");
    } else {
        res.status(404).send("No se encuentra el producto");
    }
});

app.delete("/api/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const resultado = await productManager.deleteProduct(parseInt(id));
        if (resultado) {
            // Emitimos el evento de actualización de productos a través de WebSocket
            io.emit('productUpdated', await productManager.getProducts());
            res.status(200).send("Producto eliminado");
        } else {
            res.status(404).send("No se encuentra el producto");
        }
    } catch (error) {
        res.status(500).send("Error al eliminar el producto");
    }
});

// RUTAS de carritos
app.post("/api/carts", async (req, res) => {
    await cartManager.createCart();
    res.status(201).send("Carrito creado");
});

app.get("/api/carts/:cid", async (req, res) => {
    const id = req.params.cid;
    const carrito = await cartManager.getCartById(parseInt(id));
    if (!carrito) {
        res.status(404).send("No se encuentra el carrito");
    } else {
        res.status(200).send(carrito);
    }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resultado = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
    if (resultado) {
        res.status(200).send("Producto agregado al carrito");
    } else {
        res.status(404).send("No se encuentra el carrito o producto");
    }
});

//carrito actualizado
app.put("/api/carts/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productosActualizados = req.body.products; // Se espera un array de productos en el cuerpo de la solicitud

    try {
        const resultado = await cartManager.updateCart(cartId, productosActualizados);
        if (resultado) {
            res.status(200).send(`Carrito ${cartId} actualizado correctamente`);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al actualizar el carrito");
    }
});

//actualiza la cantidad de un producto
app.put("/api/carts/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const nuevaCantidad = req.body.quantity; // Se espera que 'quantity' venga en el cuerpo de la solicitud

    try {
        const resultado = await cartManager.updateProductQuantity(cartId, productId, nuevaCantidad);
        if (resultado) {
            res.status(200).send(`Cantidad del producto ${productId} en el carrito ${cartId} actualizada a ${nuevaCantidad}`);
        } else {
            res.status(404).send("Carrito o producto no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al actualizar la cantidad del producto en el carrito");
    }
});

app.delete("/api/carts/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    try {
        const resultado = await cartManager.removeProductFromCart(cartId, productId);
        if (resultado) {
            res.status(200).send(`Producto ${productId} eliminado del carrito ${cartId}`);
        } else {
            res.status(404).send("Carrito o producto no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al eliminar el producto del carrito");
    }
});

// Configurar la conexión de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejar el nuevo producto desde el formulario en tiempo real
    socket.on('newProduct', async (productData) => {
        await productManager.addProduct(productData);
        const productosActualizados = await productManager.getProducts();
        io.emit('productUpdated', productosActualizados);
        console.log('Evento productUpdated emitido', productosActualizados);
    });
});

//LISTEN

server.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);

})