import express from "express";
import ProductManager  from "./controllers/product-manager.js";
import CartManager from "./controllers/cart-manager.js";

const app = express();
const PUERTO =8080;

app.use(express.json());

// importar el  productManager
const productManager = new ProductManager("./src/data/productos.json");
const cartManager = new CartManager("./src/data/carrito.json");


//RUTAS
app.get("/", (req, res) => {
    res.send("Hola Mundo");
})

//RUTA /products

app.get("/products", async (req, res) => {
    const arrayProductos = await productManager.getProducts();
    res.send(arrayProductos);
});

//RUTA /products:id

app.get("/api/products/:pid", async (req, res) => {
    let id = req.params.pid;

    const producto = await productManager.getProductById(parseInt(id));

    if( !producto ) {
        res.send("no se encuentra el producto");
    } else {
        res.send({producto});
    }
});

app.post("/api/products", async (req, res) => {
    const nuevoProducto = req.body;
    await productManager.addProduct(nuevoProducto);
    res.send("Producto agregado");
});

app.put("/api/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;
    await productManager.updateProduct(parseInt(id), productoActualizado);
    res.send("Producto actualizado");
});

app.delete("/api/products/:pid", async (req, res) => {
    const id = req.params.pid;
    await productManager.deleteProduct(parseInt(id));
    res.send("Producto eliminado");
});

// Rutas de carritos
app.post("/api/carts", async (req, res) => {
    await cartManager.createCart();
    res.send("Carrito creado");
});

app.get("/api/carts/:cid", async (req, res) => {
    const id = req.params.cid;
    const carrito = await cartManager.getCartById(parseInt(id));
    res.send(carrito);
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