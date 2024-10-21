import ProductModel from "../models/products.model.js";

class ProductManager {
    async addProduct(productData) {
        try {
            const nuevoProducto = new ProductModel(productData);
            await nuevoProducto.save(); // Guardar en MongoDB
            console.log('Producto agregado:', nuevoProducto);
        } catch (error) {
            console.log('Error al agregar producto:', error);
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            // Crear el filtro basado en la query proporcionada
            let filter = {};
            if (query) {
                filter = {
                    $or: [
                        { category: query },
                        { status: query === 'available' ? true : false }
                    ]
                };
            }

            // Configurar las opciones de paginación y ordenamiento
            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
            };

            // Realizar la consulta con paginación
            const result = await ProductModel.paginate(filter, options);

            return {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.hasPrevPage ? result.page - 1 : null,
                nextPage: result.hasNextPage ? result.page + 1 : null,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?page=${result.page - 1}` : null,
                nextLink: result.hasNextPage ? `/api/products?page=${result.page + 1}` : null
            };
        } catch (error) {
            console.log("Error al obtener productos:", error);
            throw new Error("Error en el servidor al obtener productos.");
        }
    }

    async getProductById(id) {
        try {
            const producto = await ProductModel.findById(id);
            return producto;
        } catch (error) {
            console.log("Error al obtener producto por ID:", error);
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const producto = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });
            console.log("Producto actualizado:", producto);
            return producto;
        } catch (error) {
            console.log("Error al actualizar producto:", error);
        }
    }

    async deleteProduct(id) {
        try {
            await ProductModel.findByIdAndDelete(id);
            console.log("Producto eliminado");
        } catch (error) {
            console.log("Error al eliminar producto:", error);
        }
    }
}

export default ProductManager;
