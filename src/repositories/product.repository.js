import ProductDAO from "../dao/product.dao.js";

class ProductRepository {
    async addProduct(productData) {
        return await ProductDAO.addProduct(productData);
    }

    async getProducts(filter, options) {
        return await ProductDAO.getProducts(filter, options);
    }

    async getProductById(id) {
        return await ProductDAO.getProductById(id);
    }

    async updateProduct(id, productData) {
        return await ProductDAO.updateProduct(id, productData);
    }

    async deleteProduct(id) {
        return await ProductDAO.deleteProduct(id);
    }
}

export default new ProductRepository();