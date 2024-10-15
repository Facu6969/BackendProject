import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: './src/.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a MongoDB");
    } catch (err) {
        console.error("No se pudo conectar a MongoDB. Revisa el código:", err);
        process.exit(1); // Termina el proceso si hay un error de conexión
    }
};

export default connectDB;
