import TicketModel from "./models/ticket.model.js";

class TicketDAO {
    async createTicket(ticketData) {
        return await TicketModel.create(ticketData);
    }

    async findTicketById(id) {
        return await TicketModel.findById(id);
    }

    async findAllTickets() {
        return await TicketModel.find();
    }
}

export default new TicketDAO();