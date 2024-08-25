import { Router } from "express";
import CartManager from "../controllers/cart-manager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.createCart();
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const resultado = await cartManager.addProductToCart(cid, pid);
        if (resultado) {
            res.status(200).send("Producto agregado al carrito");
        } else {
            res.status(404).send("No se encuentra el carrito o producto");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const productosActualizados = req.body.products;
    try {
        const resultado = await cartManager.updateCart(cid, productosActualizados);
        if (resultado) {
            res.status(200).send(`Carrito ${cid} actualizado correctamente`);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const resultado = await cartManager.updateProductQuantity(cid, pid, quantity);
        if (resultado) {
            res.status(200).send(`Cantidad del producto ${pid} en el carrito ${cid} actualizada a ${quantity}`);
        } else {
            res.status(404).send("Carrito o producto no encontrado");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const resultado = await cartManager.removeProductFromCart(cid, pid);
        if (resultado) {
            console.log(`Producto ${pid} eliminado del carrito ${cid} exitosamente`);
            res.status(200).send(`Producto ${pid} eliminado del carrito ${cid}`);
        } else {
            res.status(404).send("Carrito o producto no encontrado");
        }
    } catch (error) {
        console.log(`Error al intentar eliminar el producto ${pid} del carrito ${cid}:`, error.message);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const resultado = await cartManager.clearCart(cid);
        if (resultado) {
            res.status(200).send(`Todos los productos del carrito ${cid} han sido eliminados`);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
