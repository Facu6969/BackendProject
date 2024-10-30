import TicketDAO from "../dao/ticket.dao.js";
import CreateTicketDTO from "../dto/ticket.dto.js";

class TicketRepository {
    async createTicket(ticketData) {
        const ticketDTO = new CreateTicketDTO(ticketData);
        return await TicketDAO.createTicket(ticketDTO);
    }

    async getTicketById(id) {
        return await TicketDAO.findTicketById(id);
    }

    async getAllTickets() {
        return await TicketDAO.findAllTickets();
    }
}


export default new TicketRepository();