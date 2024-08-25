import { Router } from "express";
import ProductModel from "../models/products.model.js"; 

const router = Router();

// RUTA raíz: Obtener todos los productos y renderizarlos en la vista 'home'
router.get("/products", async (req, res) => {
    try {
        const productos = await ProductModel.find().lean(); // Consultar todos los productos de MongoDB
        res.render("home", { products: productos }); // Renderizar la vista con los productos obtenidos
    } catch (error) {
        res.status(500).send("Error al obtener los productos");
    }
});

// RUTA para la vista real-time products con Socket.io
router.get("/realtimeproducts", async (req, res) => {
    try {
        const productos = await ProductModel.find().lean(); // Consultar todos los productos de MongoDB
        res.render("realTimeProducts", { products: productos }); // Renderizar la vista con los productos obtenidos
    } catch (error) {
        res.status(500).send("Error al obtener los productos en tiempo real");
    }
});

export default router;
