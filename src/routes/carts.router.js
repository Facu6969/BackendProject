import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.post('/', authMiddleware(['user']), CartController.createCart);

router.get('/:cid', authMiddleware(['user']), CartController.getCartById);

router.post('/:cid/product/:pid', authMiddleware(['user']), CartController.addProductToCart);

router.put('/:cid', authMiddleware(['user']), CartController.updateCart);

// Actualizar la cantidad de un producto en el carrito 
router.put('/:cid/products/:pid', authMiddleware(['user']), CartController.updateProductQuantity);

router.delete('/:cid/products/:pid', authMiddleware(['user']), CartController.removeProductFromCart);

router.delete('/:cid', authMiddleware(['user']), CartController.clearCart);

export default router;
