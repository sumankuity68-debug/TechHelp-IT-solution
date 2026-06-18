import PDFDocument from 'pdfkit';

/**
 * Generates a clean, professional invoice PDF from order details
 * @param {Object} order - The MongoDB order object
 * @returns {Promise<Buffer>} - Returns a buffer containing the raw PDF data
 */
export const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // ── Header / Brand ──
      doc
        .fillColor('#4f46e5')
        .fontSize(20)
        .text('TechHelp IT Solutions', 50, 45)
        .fillColor('#64748b')
        .fontSize(10)
        .text('Kolkata, West Bengal, India', 50, 70)
        .text('Email: sumankuity68@gmail.com', 50, 85)
        .moveDown();

      // Title
      doc
        .fillColor('#1e293b')
        .fontSize(22)
        .text('INVOICE', 200, 50, { align: 'right' })
        .fontSize(10)
        .fillColor('#64748b')
        .text(`Invoice No: ${order.invoiceNumber || 'INV-TEMP'}`, 200, 75, { align: 'right' })
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 200, 90, { align: 'right' })
        .moveDown();

      // Divider line
      doc
        .strokeColor('#cbd5e1')
        .lineWidth(1)
        .moveTo(50, 115)
        .lineTo(550, 115)
        .stroke();

      // ── Bill To & Details ──
      doc
        .fillColor('#0f172a')
        .fontSize(12)
        .text('BILL TO:', 50, 135)
        .fontSize(10)
        .fillColor('#334155')
        .text(`Name:  ${order.customerName}`, 50, 155)
        .text(`Email: ${order.customerEmail}`, 50, 170)
        .moveDown();

      doc
        .fillColor('#0f172a')
        .fontSize(12)
        .text('PAYMENT DETAILS:', 300, 135)
        .fontSize(10)
        .fillColor('#334155')
        .text(`Status:         PAID`, 300, 155)
        .text(`Gateway:      Stripe`, 300, 170)
        .text(`Session ID:   ${(order.stripeSessionId || '').substring(0, 20)}...`, 300, 185)
        .moveDown();

      // Table Header
      const tableTop = 230;
      doc
        .strokeColor('#cbd5e1')
        .lineWidth(1)
        .moveTo(50, tableTop)
        .lineTo(550, tableTop)
        .stroke();

      doc
        .fillColor('#4f46e5')
        .fontSize(10)
        .text('Description', 60, tableTop + 8)
        .text('Qty', 350, tableTop + 8, { width: 50, align: 'center' })
        .text('Amount', 450, tableTop + 8, { width: 100, align: 'right' });

      doc
        .strokeColor('#cbd5e1')
        .lineWidth(1)
        .moveTo(50, tableTop + 25)
        .lineTo(550, tableTop + 25)
        .stroke();

      // Table Row
      const rowTop = tableTop + 35;
      const amountFormatted = `$${(order.amount / 100).toFixed(2)}`;
      doc
        .fillColor('#334155')
        .text(`TechHelp IT Solutions - ${order.planName} Plan (${order.billing})`, 60, rowTop)
        .text('1', 350, rowTop, { width: 50, align: 'center' })
        .text(amountFormatted, 450, rowTop, { width: 100, align: 'right' });

      doc
        .strokeColor('#e2e8f0')
        .lineWidth(1)
        .moveTo(50, rowTop + 20)
        .lineTo(550, rowTop + 20)
        .stroke();

      // Total row
      const totalTop = rowTop + 35;
      doc
        .fillColor('#0f172a')
        .fontSize(11)
        .text('Total Paid:', 350, totalTop, { width: 80, align: 'right' })
        .text(amountFormatted, 450, totalTop, { width: 100, align: 'right' });

      // Footer Notes
      doc
        .strokeColor('#cbd5e1')
        .lineWidth(0.5)
        .moveTo(50, 400)
        .lineTo(550, 400)
        .stroke();

      doc
        .fillColor('#64748b')
        .fontSize(9)
        .text('Thank you for choosing TechHelp IT Solutions!', 50, 415, { align: 'center' })
        .text('If you have any questions about this invoice, contact us at sumankuity68@gmail.com', 50, 430, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
