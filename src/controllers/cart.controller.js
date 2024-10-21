import CartService from "../services/cart.service.js";

class CartController {
    async createCart(req, res) {
        try {
            const newCart = await CartService.createCart({});
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ message: "Error al crear el carrito", error: error.message });
        }
    }

    async getCartById(req, res) {
        try {
            const { cid } = req.params;
            const cart = await CartService.getCartById(cid);
            if (!cart) {
                return res.status(404).json({ message: "Carrito no encontrado" });
            }
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
        }
    }

    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const result = await CartService.addProductToCart(cid, pid, quantity);
            if (!result) {
                return res.status(404).json({ message: "Carrito o producto no encontrado" });
            }
            res.status(201).json({ message: "Producto agregado al carrito" });
        } catch (error) {
            res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
        }
    }

    async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
            const updatedCart = await CartService.updateCart(cid, products);
            res.json({ message: "Carrito actualizado", carrito: updatedCart });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el carrito", error: error.message });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const result = await CartService.updateProductQuantity(cid, pid, quantity);
            res.status(200).json({ message: `Cantidad del producto ${pid} actualizada a ${quantity}` });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar la cantidad del producto", error: error.message });
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const result = await CartService.removeProductFromCart(cid, pid);
            res.status(200).json({ message: `Producto eliminado del carrito ${cid}` });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });
        }
    }

    async clearCart(req, res) {
        try {
            const { cid } = req.params;
            const result = await CartService.clearCart(cid);
            res.status(200).json({ message: `Carrito ${cid} vaciado` });
        } catch (error) {
            res.status(500).json({ message: "Error al vaciar el carrito", error: error.message });
        }
    }
}

export default new CartController();