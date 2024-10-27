import TicketModel from "../dao/models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

class TicketService {
    async createTicket({ amount, purchaser }) {
        try {
            const code = uuidv4(); // Generar un código único para el ticket
            const newTicket = new TicketModel({
                code,
                amount,
                purchaser,
            });

            await newTicket.save();
            return newTicket;
        } catch (error) {
            console.error("Error al crear el ticket:", error);
            throw new Error("Error al crear el ticket");
        }
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await TicketModel.findById(ticketId);
            return ticket;
        } catch (error) {
            console.error("Error al obtener el ticket:", error);
            throw new Error("Error al obtener el ticket");
        }
    }
}

export default new TicketService();