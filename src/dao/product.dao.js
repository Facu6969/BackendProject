import ProductModel from "./models/products.model.js";

class ProductDAO {
    async addProduct(productData) {
        const nuevoProducto = new ProductModel(productData);
        return await nuevoProducto.save(); // Guardar en MongoDB
    }

    async getProducts(filter, options) {
        return await ProductModel.paginate(filter, options);
    }

    async getProductById(id) {
        return await ProductModel.findById(id);
    }

    async updateProduct(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
    }

    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}

export default new ProductDAO();