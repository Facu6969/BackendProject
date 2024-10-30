import dotenv from "dotenv";
dotenv.config({ path: './src/.env' });
import nodemailer from "nodemailer";


const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Email desde el cual se envían los correos
        pass: process.env.GMAIL_PASS  // Contraseña o App Password para el correo
    }
});

// Verificación de la conexión y autenticación
transport.verify((error, success) => {
    if (error) {
        console.log("Error en la configuración de transporte:", error);
    } else {
        console.log("Configuración de transporte exitosa:", success);
    }
});

export default transport;