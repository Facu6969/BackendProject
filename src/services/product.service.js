import ProductRepository from "../repositories/product.repository.js";
import CreateProductDTO from "../dto/product.dto.js";

class ProductService {
    async addProduct(productData) {
        const productDTO = new CreateProductDTO(productData);
        return await ProductRepository.addProduct(productDTO);
    }

    async getProducts({ limit = 10, page = 1, sort, query }) {
        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { category: query },
                    { status: query === 'available' ? true : false }
                ]
            };
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };

        return await ProductRepository.getProducts(filter, options);
    }

    async getProductById(id) {
        const product = await ProductRepository.getProductById(id);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
    }

    async updateProduct(id, productData) {
        const productDTO = new CreateProductDTO(productData);
        const updatedProduct = await ProductRepository.updateProduct(id, productDTO);
        if (!updatedProduct) {
            throw new Error("Error al actualizar el producto");
        }
        return updatedProduct;
    }

    async deleteProduct(id) {
        const deletedProduct = await ProductRepository.deleteProduct(id);
        if (!deletedProduct) {
            throw new Error("Producto no encontrado");
        }
        return deletedProduct;
    }
}

export default new ProductService();