import { Router } from "express";
import mongoose from "mongoose";
import ProductManager from "../controllers/product-manager.js"; 

const router = Router();
const productManager = new ProductManager(); // Crea una instancia de ProductManager

// Obtener todos los productos
router.get("/", async (req, res) => {
    try {
        // Pasar los parámetros de query a la función `getProducts`
        const { limit, page, sort, query } = req.query;
        const productos = await productManager.getProducts({ limit, page, sort, query });

        res.json(productos);  // Devuelve el objeto con la estructura especificada
    } catch (error) {
        console.log("Error en la consulta:", error); 
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ message: "ID de producto no válido" });
    }

    try {
        const producto = await productManager.getProductById(req.params.pid);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
    try {
        const nuevoProducto = await productManager.addProduct(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ message: "Error al crear el producto", error });
    }
});

// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ message: "ID de producto no válido" });
    }

    try {
        const productoActualizado = await productManager.updateProduct(req.params.pid, req.body);
        if (productoActualizado) {
            res.json(productoActualizado);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error });
    }
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ message: "ID de producto no válido" });
    }

    try {
        const productoEliminado = await productManager.deleteProduct(req.params.pid);
        if (productoEliminado) {
            res.json({ message: "Producto eliminado", productoEliminado });
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error });
    }
});

export default router;
