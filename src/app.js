import express from "express";
import ProductManager  from "./controllers/product-manager.js";

const app = express();
const PUERTO =8080;

// importar el  productManager
const manager = new ProductManager("./src/data/productos.json");

//RUTAS
app.get("/", (req, res) => {
    res.send("Hola Mundo");
})

//RUTA /products

app.get("/products", async (req, res) => {
    const arrayProductos = await manager.getProducts();
    res.send(arrayProductos);
})

//LISTEN

app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);

})