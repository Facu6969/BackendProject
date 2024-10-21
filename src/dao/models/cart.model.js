import mongoose from "mongoose";

const cartsCollection = "Carts";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products" // Esto se refiere al modelo de productos
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

const CartModel = mongoose.model(cartsCollection, cartSchema);

export default CartModel;
