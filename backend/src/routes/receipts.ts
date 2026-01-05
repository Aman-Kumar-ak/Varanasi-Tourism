import express, { Request, Response } from 'express';
import connectDB from '../lib/db.js';
import Booking from '../models/Booking.js';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

const router = express.Router();

// All receipt routes require authentication
router.use(verifyAuth);

// Generate PDF receipt
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })
      .populate('jyotirlingaId', 'name city state')
      .populate('darshanTypeId', 'name price')
      .populate('timeSlotId', 'startTime endTime');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${booking.receiptNumber}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Header
    doc.fontSize(24).text('Jyotirlinga Booking Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Receipt Number: ${booking.receiptNumber}`, { align: 'center' });
    doc.text(`Booking Date: ${new Date(booking.date).toLocaleDateString('en-IN')}`, { align: 'center' });
    doc.moveDown(2);

    // Booking Details
    doc.fontSize(16).text('Booking Details', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Temple: ${(booking.jyotirlingaId as any).name.en || (booking.jyotirlingaId as any).name.hi}`);
    doc.text(`Location: ${(booking.jyotirlingaId as any).city}, ${(booking.jyotirlingaId as any).state}`);
    doc.text(`Darshan Type: ${(booking.darshanTypeId as any).name.en || (booking.darshanTypeId as any).name.hi}`);
    doc.text(`Date & Time: ${new Date(booking.date).toLocaleDateString('en-IN')} (${(booking.timeSlotId as any).startTime} - ${(booking.timeSlotId as any).endTime})`);
    doc.moveDown();

    // Contact Information
    doc.fontSize(16).text('Contact Information', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Name: ${booking.primaryContact.name}`);
    doc.text(`Phone: ${booking.primaryContact.phone}`);
    if (booking.primaryContact.email) {
      doc.text(`Email: ${booking.primaryContact.email}`);
    }
    doc.moveDown();

    // Attendees
    doc.fontSize(16).text('Attendees', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    
    if (booking.adults && booking.adults.length > 0) {
      doc.text(`Adults (${booking.adults.length}):`);
      booking.adults.forEach((adult: any, index: number) => {
        doc.text(`  ${index + 1}. ${adult.name} (${adult.age} years, ${adult.gender})`, { indent: 20 });
      });
      doc.moveDown();
    }

    if (booking.children && booking.children.length > 0) {
      doc.text(`Children (${booking.children.length}):`);
      booking.children.forEach((child: any, index: number) => {
        doc.text(`  ${index + 1}. ${child.name} (${child.age} years, ${child.gender})`, { indent: 20 });
      });
      doc.moveDown();
    }

    // Payment Summary
    doc.fontSize(16).text('Payment Summary', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Total Attendees: ${(booking.adults?.length || 0) + (booking.children?.length || 0)}`);
    doc.text(`Price per Person: ₹${(booking.darshanTypeId as any).price}`);
    doc.moveDown();
    doc.fontSize(14).text(`Total Amount: ₹${booking.amount}`, { align: 'right' });
    doc.text(`Payment Status: ${booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}`, { align: 'right' });
    doc.moveDown(2);

    // Generate QR Code
    try {
      const qrData = JSON.stringify({
        receiptNumber: booking.receiptNumber,
        bookingId: booking._id.toString(),
        temple: (booking.jyotirlingaId as any).name.en,
        date: new Date(booking.date).toISOString(),
      });
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, { width: 150 });
      doc.image(qrCodeDataURL, doc.page.width / 2 - 75, doc.y, { width: 150 });
      doc.moveDown(3);
      doc.fontSize(10).text('Scan QR code for booking verification', { align: 'center' });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for your booking!', { align: 'center' });
    doc.text('For any queries, please contact the temple office.', { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating receipt:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate receipt',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});

export default router;

