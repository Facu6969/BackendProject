import express from "express";
import ProductManager  from "./controllers/product-manager.js";
import CartManager from "./controllers/cart-manager.js";

const app = express();
const PUERTO =8080;

app.use(express.json());

// importar el  productManager
const productManager = new ProductManager("./src/data/productos.json");
const cartManager = new CartManager("./src/data/carrito.json");


//RUTA raiz
app.get("/", (req, res) => {
    res.send("Hola Mundo");
})

//RUTA /products

app.get("/api/products", async (req, res) => {
    const arrayProductos = await productManager.getProducts();
    res.status(200).send(arrayProductos);
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
    const nuevoProducto = req.body;
    await productManager.addProduct(nuevoProducto);
    res.status(201).send("Producto agregado");
});

app.put("/api/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;
    const resultado = await productManager.updateProduct(parseInt(id), productoActualizado);
    if (resultado) {
        res.status(200).send("Producto actualizado");
    } else {
        res.status(404).send("No se encuentra el producto");
    }
});

app.delete("/api/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const resultado = await productManager.deleteProduct(parseInt(id));
    if (resultado) {
        res.status(200).send("Producto eliminado");
    } else {
        res.status(404).send("No se encuentra el producto");
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
    await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
    res.send("Producto agregado al carrito");
});

//LISTEN

app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);

})