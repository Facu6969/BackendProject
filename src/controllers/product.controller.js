import ProductService from "../services/product.service.js";

class ProductController {
    async getProducts(req, res) {
        try {
            const { limit, page, sort, query } = req.query;
            const products = await ProductService.getProducts({ limit, page, sort, query });
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los productos", error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.pid);
            res.json(product);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async addProduct(req, res) {
        try {
            const newProduct = await ProductService.addProduct(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: "Error al crear el producto", error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const updatedProduct = await ProductService.updateProduct(req.params.pid, req.body);
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const deletedProduct = await ProductService.deleteProduct(req.params.pid);
            res.json(deletedProduct);
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
        }
    }
}

export default new ProductController();