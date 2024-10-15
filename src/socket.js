// src/socket.js
import { Server } from "socket.io";

const setupSocket = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');

        socket.on('newProduct', async (productData) => {
            await ProductModel.create(productData);
            const productosActualizados = await ProductModel.find();
            io.emit('productUpdated', productosActualizados);
            console.log('Evento productUpdated emitido', productosActualizados);
        });
    });

    return io; // Devuelve la instancia de io si la necesitas en otro lugar
};

export default setupSocket;
