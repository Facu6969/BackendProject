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

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("Carrito no encontrado");
                return false;
            }

            const product = await ProductModel.findById(productId);
            if (!product || product.stock < quantity) {
                console.log("Producto no encontrado o stock insuficiente");
                return false;
            }

            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity: quantity });
            }

            product.stock -= quantity; // Reducir el stock por la cantidad agregada
            await product.save();
            await cart.save();

            return true;
        } catch (error) {
            console.log("Error al agregar producto al carrito:", error);
            throw new Error("No se pudo agregar el producto al carrito");
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return false;

            const productInCart = cart.products.find(p => p.product.equals(productId));
            if (!productInCart) return false;

            const product = await ProductModel.findById(productId);
            if (!product) return false;

            // Ajustar el stock del producto
            const difference = quantity - productInCart.quantity;
            if (product.stock < difference) {
                console.log("Stock insuficiente para actualizar la cantidad");
                return false;
            }
            productInCart.quantity = quantity;
            product.stock -= difference;

            await product.save();
            await cart.save();
            return true;
        } catch (error) {
            console.log('Error al actualizar la cantidad del producto en el carrito:', error);
            throw new Error('No se pudo actualizar la cantidad del producto en el carrito');
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return false;
    
            const productInCart = cart.products.find(p => p.product.equals(productId));
            if (!productInCart) return false;
    
            // Restaurar el stock del producto antes de eliminarlo
            const product = await ProductModel.findById(productId);
            if (!product) return false;
    
            product.stock += productInCart.quantity; // Restaurar la cantidad de stock
            await product.save();
    
            // Eliminar el producto del carrito
            cart.products = cart.products.filter(p => !p.product.equals(productId));
            await cart.save();
    
            return true;
        } catch (error) {
            console.log('Error al eliminar el producto del carrito:', error);
            throw new Error('No se pudo eliminar el producto del carrito');
        }
    }
    

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) return false;

            // Restablecer el stock de cada producto antes de vaciar el carrito
            for (const item of cart.products) {
                const product = await ProductModel.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }

            cart.products = []; // Vaciar el array de productos
            await cart.save();
            return true;
        } catch (error) {
            console.log('Error al vaciar el carrito:', error);
            throw new Error('No se pudo vaciar el carrito');
        }
    }

    async findCartById(id) { //busca y devuelve el carrito junto con su ID
        try {
            const carrito = await this.getCartById(id);
            if (carrito) {
                console.log('Carrito encontrado:', carrito);
                console.log('ID del carrito:', carrito._id);
                return carrito;
            } else {
                console.log('Carrito no encontrado');
                return null;
            }
        } catch (error) {
            console.log("Error al buscar el carrito:", error);
            throw error;
        }
    }
    
}

export default CartManager;
