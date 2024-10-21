class CreateCartDTO {
    constructor({ products }) {
        this.products = products.map(product => ({
            product: product.product,
            quantity: product.quantity || 1 
        }));
    }
}

export default CreateCartDTO;
