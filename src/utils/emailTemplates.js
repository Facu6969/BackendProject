export const generateTicketHTML = (ticket) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #333;">Resumen de su Compra</h1>
        <p>Gracias por su compra, <strong>${ticket.purchaser}</strong>.</p>
        <p><strong>Código de Ticket:</strong> ${ticket.code}</p>
        <p><strong>Total:</strong> $${ticket.amount}</p>
        <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 0.9em;">Esperamos que disfrute de su compra. ¡Gracias por confiar en nosotros!</p>
    </div>
`;
