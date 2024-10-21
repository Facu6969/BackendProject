import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// Obtener todos los productos
router.get('/', authMiddleware(['user', 'admin']), ProductController.getProducts);

// Obtener un producto por ID
router.get("/:pid", authMiddleware(['user', 'admin']), ProductController.getProductById);

// Crear un nuevo producto
router.post('/', authMiddleware(['admin']), ProductController.addProduct);

// Actualizar un producto por ID
router.put("/:pid", authMiddleware(['admin']), ProductController.updateProduct);

// Eliminar un producto por ID
router.delete("/:pid", authMiddleware(['admin']), ProductController.deleteProduct);

export default router;
