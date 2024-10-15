import { Router } from "express";
import mongoose from "mongoose";
import authMiddleware from "../middleware/auth.js";
import ProductManager from "../controllers/product-manager.js"; 

const router = Router();
const productManager = new ProductManager(); // Crea una instancia de ProductManager

// Obtener todos los productos
router.get('/', authMiddleware(['user', 'admin']), async (req, res) => {
    try {
      const { limit, page, sort, query } = req.query; // Opciones de consulta opcionales
      const productos = await productManager.getProducts({ limit, page, sort, query });
  
      res.json(productos); // Devuelve los productos en formato JSON
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
  });

// Obtener un producto por ID
router.get("/:pid", authMiddleware(['user', 'admin']), async (req, res) => {
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
router.post('/', authMiddleware(['admin']), async (req, res) => {
    try {
      const nuevoProducto = await productManager.addProduct(req.body);
      res.status(201).json(nuevoProducto);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el producto', error: error.message });
    }
  });

// Actualizar un producto por ID
router.put("/:pid", authMiddleware(['admin']), async (req, res) => {
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
router.delete("/:pid", authMiddleware(['admin']), async (req, res) => {
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
