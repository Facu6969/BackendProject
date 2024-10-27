import mongoose from "mongoose";

const ticketsCollection = "Tickets";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
});

const TicketModel = mongoose.model(ticketsCollection, ticketSchema);

export default TicketModel;