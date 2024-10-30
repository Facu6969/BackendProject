import CartRepository from "../repositories/cart.repository.js";
import CreateCartDTO from "../dto/cart.dto.js";
import TicketService from "./ticket.service.js";
import EmailService from "./email.service.js";

class CartService {
    async createCart(cartData) {
        const cartDTO = new CreateCartDTO(cartData); // Usamos el DTO para formatear los datos
        return await CartRepository.createCart(cartDTO);
    }

    async getCartById(id) {
        return await CartRepository.getCartById(id);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await CartRepository.addProductToCart(cartId, productId, quantity);
    }

    async updateCart(cartId, products) {
        const cartDTO = new CreateCartDTO({ products });
        return await CartRepository.updateCart(cartId, cartDTO);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await CartRepository.updateProductQuantity(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        return await CartRepository.removeProductFromCart(cartId, productId);
    }

    async clearCart(cartId) {
        return await CartRepository.clearCart(cartId);
    }

    async purchaseCart(cartId, purchaserEmail) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        let totalAmount = 0;
        const unavailableProducts = [];

        // Procesar cada producto del carrito
        for (const item of cart.products) {
            const product = item.product;
            const requestedQuantity = item.quantity;

            // Verificar stock disponible
            if (product.stock >= requestedQuantity) {
                product.stock -= requestedQuantity;
                totalAmount += product.price * requestedQuantity;
                await ProductService.updateProductStock(product._id, product.stock);
            } else {
                unavailableProducts.push(product._id);
            }
        }

        // Filtrar los productos que no pudieron comprarse
        cart.products = cart.products.filter(item => unavailableProducts.includes(item.product._id));
        await CartRepository.updateCart(cartId, cart.products);

        // Generar un ticket solo si hubo al menos un producto comprado
        let ticket = null;
        if (totalAmount > 0) {
            ticket = await TicketService.createTicket({
                amount: totalAmount,
                purchaser: purchaserEmail
            });
        }

        return { ticket, unavailableProducts };
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const user = req.user;
    
            // Procesar la compra y generar el ticket
            const { ticket, unavailableProducts } = await CartService.purchaseCart(cid, user.email);
    
            // Enviar el correo solo si se generó un ticket de compra
            if (ticket) {
                await EmailService.sendPurchaseTicket(ticket);
            }
    
            return res.status(201).json({
                message: "Compra realizada con éxito",
                ticket,
                unavailableProducts
            });
        } catch (error) {
            console.error("Error al procesar la compra:", error);
            res.status(500).json({ message: "Error al procesar la compra", error: error.message });
        }
    }
}

export default new CartService();
