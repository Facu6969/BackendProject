import mongoosePaginate from "mongoose-paginate-v2";
import mongoose from "mongoose";

// Nombre de la colección debe coincidir exactamente con la colección en MongoDB
const productsCollection = "Products"; 

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String },
    code: { type: String, required: true, unique: true }, // Campo único para evitar duplicados
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, required: true, default: true }, // Campo booleano con valor por defecto true
    thumbnails: { type: [String] } // Array de strings
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model(productsCollection, productSchema);

export default ProductModel;