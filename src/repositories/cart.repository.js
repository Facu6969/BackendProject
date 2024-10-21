import CartModel from "../dao/models/cart.model.js";
import ProductModel from "../dao/models/products.model.js";

class CartRepository {
    async createCart(cartData) {
        const newCart = new CartModel(cartData);
        await newCart.save();
        return newCart;
    }

    async getCartById(id) {
        return await CartModel.findById(id).populate('products.product');
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        if (!cart) return null;

        const product = await ProductModel.findById(productId);
        if (!product || product.stock < quantity) return null;

        const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        product.stock -= quantity;
        await product.save();
        await cart.save();

        return cart;
    }

    async updateCart(cartId, cartDTO) {
        const updatedCart = await CartModel.findByIdAndUpdate(cartId, cartDTO, { new: true });
        return updatedCart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        const productInCart = cart.products.find(p => p.product.equals(productId));
        if (!productInCart) return null;

        const product = await ProductModel.findById(productId);
        if (!product) return null;

        const difference = quantity - productInCart.quantity;
        if (product.stock < difference) return null;

        productInCart.quantity = quantity;
        product.stock -= difference;

        await product.save();
        await cart.save();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        const productInCart = cart.products.find(p => p.product.equals(productId));
        if (!productInCart) return null;

        const product = await ProductModel.findById(productId);
        if (!product) return null;

        product.stock += productInCart.quantity;
        await product.save();

        cart.products = cart.products.filter(p => !p.product.equals(productId));
        await cart.save();

        return cart;
    }

    async clearCart(cartId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        for (const item of cart.products) {
            const product = await ProductModel.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        cart.products = [];
        await cart.save();
        return cart;
    }
}

export default new CartRepository();