class CreateProductDTO {
    constructor({ title, description, price, code, stock, category, thumbnails, img }) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails || [];
        this.img = img || (this.thumbnails.length > 0 ? this.thumbnails[0] : null);  // Asignar img desde thumbnails si no se proporciona
        this.status = true; 
    }
}

export default CreateProductDTO;
