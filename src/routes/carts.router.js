import { Router } from "express";
import mongoose from "mongoose"; 
import CartManager from "../controllers/cart-manager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.createCart();
        console.log('ID del nuevo carrito:', nuevoCarrito._id);
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).json({ message: "ID de carrito no válido" });
    }

    try {
        const carrito = await cartManager.findCartById(cartId);
        if (carrito) {
            res.status(200).json(carrito);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // Validar ObjectIds
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ message: "ID de carrito o producto no válido" });
    }

    try {
        const resultado = await cartManager.addProductToCart(cid, pid, quantity);
        if (resultado) {
            res.status(200).send(`Producto ${pid} agregado al carrito ${cid}`);
        } else {
            res.status(404).send("Carrito o producto no encontrado");
        }
    } catch (error) {
        console.log(`Error al intentar agregar el producto ${pid} al carrito ${cid}:`, error.message);
        res.status(500).json({ message: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const productosActualizados = req.body.products;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ message: "ID de carrito no válido" });
    }

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

    // Validar ObjectIds
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ message: "ID de carrito o producto no válido" });
    }

    try {
        const resultado = await cartManager.updateProductQuantity(cid, pid, quantity);
        if (resultado) {
            res.status(200).send(`Cantidad del producto ${pid} en el carrito ${cid} actualizada a ${quantity}`);
        } else {
            res.status(404).send("Carrito o producto no encontrado");
        }
    } catch (error) {
        console.log(`Error al intentar actualizar la cantidad del producto ${pid} en el carrito ${cid}:`, error.message);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    // Validar ObjectIds
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ message: "ID de carrito o producto no válido" });
    }

    try {
        const resultado = await cartManager.removeProductFromCart(cid, pid);
        if (resultado) {
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

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ message: "ID de carrito no válido" });
    }

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
