import { promises as fs } from "fs";
import ProductManager from "./product-manager.js";

class CartManager {
    static ultId = 0;

    constructor(path) {
        this.carts = [];
        this.path = path;
        this.productManager = new ProductManager("./src/data/productos.json");
        this.cargarArray();
    }

    async cargarArray() {
        try {
            this.carts = await this.leerArchivo();
        } catch (error) {
            console.log("Error al inicializar CartManager", error.message);
        }
    }

    async createCart() {
        const lastCartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
        const nuevoCarrito = {
            id: lastCartId + 1,
            products: []
        };
        this.carts.push(nuevoCarrito);
        await this.guardarArchivo(this.carts);
    }

    async getCartById(id) {
        try {
            const arrayCarts = await this.leerArchivo();
            const buscado = arrayCarts.find(item => item.id === id);
            return buscado || null;
        } catch (error) {
            console.log("Error al buscar carrito por id", error);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const arrayCarts = await this.leerArchivo();
            const cartIndex = arrayCarts.findIndex(cart => cart.id === cartId);
            if (cartIndex === -1) {
                console.log("Carrito no encontrado");
                return false;
            }

            const product = await this.productManager.getProductById(productId);
            if (!product) {
                console.log("Producto no encontrado");
                return false;
            }

            const cart = arrayCarts[cartIndex];
            const productIndex = cart.products.findIndex(product => product.product === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }
            await this.guardarArchivo(arrayCarts);
        } catch (error) {
            console.log("Error al agregar producto al carrito", error);
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            if (respuesta) {
                return JSON.parse(respuesta);
            } else {
                return [];
            }
        } catch (error) {
            console.log("Error al leer el archivo", error);
            return [];
        }
    }

    async guardarArchivo(arrayCarts) {
        await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2));
    }

    async updateCart(cartId, products) {
        const cart = await this.getCartById(cartId);
        if (!cart) return false;
    
        cart.products = products;
        await this.guardarArchivo(this.carts); // Guardar los cambios en el archivo
        return true;
    }
    
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        if (!cart) return false;
    
        const product = cart.products.find(product => product.id === productId); //Si el carrito existe, busca el producto dentro de ese carrito.
        if (product) { 
            product.quantity = quantity; //Actualiza la cantidad del producto encontrado
            await this.guardarArchivo(this.carts); 
            return true; //Devuelve true si la operación fue exitosa
        }
        return false;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) return false;  // Si no se encuentra el carrito, retorna false
        
        const productIndex = cart.products.findIndex(product => product.product === productId);
        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);  // Elimina el producto del carrito
            await this.guardarArchivo(this.carts);  // Guarda el array actualizado de carritos
            return true;
        }
        return false;  // Si no se encuentra el producto, retorna false
    }
}

export default CartManager;
