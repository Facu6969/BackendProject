import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });
import transport from "../utils/email.transporter.js";
import { generateTicketHTML } from "../utils/emailTemplates.js";


class EmailService {
    async sendPurchaseTicket(ticket) {
        try {
            // Construir el contenido del email con HTML dinámico
            const htmlContent = generateTicketHTML(ticket);

            await transport.sendMail({
                from: process.env.GMAIL_USER,
                to: ticket.purchaser,
                subject: "Gracias por su compra - Ticket de Confirmación",
                html: htmlContent
            });

            console.log(`Correo enviado a: ${ticket.purchaser}`);
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            throw new Error("No se pudo enviar el correo de confirmación");
        }
    }

    async sendVerificationEmail(email, verificationToken) {
        const verificationUrl = `http://localhost:8080/api/sessions/verify/${verificationToken}`;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Verifica tu cuenta',
            html: `<p>Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
                   <a href="${verificationUrl}">Verificar cuenta</a>`
        };

        try {
            await transport.sendMail(mailOptions);
            console.log("Correo de verificación enviado a:", email);
        } catch (error) {
            console.error("Error al enviar el correo de verificación:", error);
            throw new Error("No se pudo enviar el correo de verificación.");
        }
    }
}

export default new EmailService();