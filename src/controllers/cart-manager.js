import CartModel from "../models/cart.model.js";
import ProductModel from "../models/products.model.js";

class CartManager {
    async createCart() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear el carrito:", error);
            throw new Error("No se pudo crear el carrito");
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id).populate('products.product');
            return cart;
        } catch (error) {
            console.log("Error al buscar carrito por id:", error);
            throw new Error("No se pudo obtener el carrito");
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("Carrito no encontrado");
                return false;
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                console.log("Producto no encontrado");
                return false;
            }

            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
            return true;
        } catch (error) {
            console.log("Error al agregar producto al carrito:", error);
            throw new Error("No se pudo agregar el producto al carrito");
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return false;

            cart.products = products; // Reemplazar el array de productos del carrito con el nuevo array proporcionado
            await cart.save();
            return true; // Retorna true si la actualización fue exitosa
        } catch (error) {
            throw new Error('Error al actualizar el carrito');
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return false;

            const productInCart = cart.products.find(p => p.product.equals(productId));
            if (productInCart) {
                productInCart.quantity = quantity;
                await cart.save();
                return true;
            }
            return false;
        } catch (error) {
            throw new Error('Error al actualizar la cantidad del producto en el carrito');
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return false;

            cart.products = cart.products.filter(p => !p.product.equals(productId));
            await cart.save();
            return true;
        } catch (error) {
            throw new Error('Error al eliminar el producto del carrito');
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return false;

            cart.products = []; // Vaciar el array de productos
            await cart.save();
            return true;
        } catch (error) {
            throw new Error('Error al eliminar todos los productos del carrito');
        }
    }
}

export default CartManager;
