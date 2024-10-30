import TicketRepository from "../repositories/ticket.repository.js";
import { v4 as uuidv4 } from "uuid";

class TicketService {
    async createTicket({ amount, purchaser }) {
        try {
            const ticketData = {
                code: uuidv4(), // Genera un código único
                purchase_datetime: new Date(),
                amount,
                purchaser
            };
            const newTicket = await TicketRepository.createTicket(ticketData);
            return newTicket;
        } catch (error) {
            console.error("Error al crear el ticket:", error);
            throw new Error("No se pudo crear el ticket");
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