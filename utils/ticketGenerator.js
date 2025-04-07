const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateTicket = (bookingId, event, user) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const filePath = `./tickets/ticket_${bookingId}.pdf`;
    
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text('Event Ticket', { align: 'center' });
    doc.text(`Event: ${event.title}`);
    doc.text(`User: ${user.name}`);
    doc.text(`Date: ${event.date}`);
    doc.text(`Price: $${event.price}`);
    doc.end();

    resolve(filePath);
  });
};

module.exports = { generateTicket };