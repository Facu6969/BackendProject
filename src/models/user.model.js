import mongoose from "mongoose";

const cartsCollection = "Carts";

const userSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        default: ""
    },
    email:{
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId, // Referencia a Carts
        ref: cartsCollection // modelo Carts 
    },
    role: {
        type: String,
        default: "user" 
    }
})

const UserModel = mongoose.model("user", userSchema);

export default UserModel;