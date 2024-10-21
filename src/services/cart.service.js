import CartRepository from "../repositories/cart.repository.js";
import CreateCartDTO from "../dto/cart.dto.js";

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
}

export default new CartService();
