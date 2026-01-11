// backend/src/controllers/complaintController.js
const PDFDocument = require('pdfkit');
const { getDB } = require('../db/connection');

/**
 * Generate complaint letter PDF
 */
exports.generateComplaintPDF = async (req, res, next) => {
  try {
    const {
      passengerName,
      passengerEmail,
      passengerAddress,
      flightNumber,
      airline,
      pnr,
      flightDate,
      departureAirport,
      arrivalAirport,
      issueType,
      issueDescription,
      compensationAmount,
      supportingDocs = []
    } = req.body;

    // Create a new PDF document
    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 50,
      info: {
        Title: `Complaint Letter - ${airline} ${flightNumber}`,
        Author: 'Airport Passenger Rights Platform',
        Subject: `Flight Complaint: ${issueType}`
      }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 
      `attachment; filename="complaint-${airline}-${flightNumber}-${Date.now()}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    // Header
    doc.fontSize(20).text('FORMAL COMPLAINT LETTER', { align: 'center' });
    doc.moveDown();

    // Date
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString('en-IN')}`);
    doc.moveDown();

    // Passenger Details
    doc.fontSize(14).text('Passenger Details:', { underline: true });
    doc.fontSize(12).text(`Name: ${passengerName}`);
    doc.text(`Email: ${passengerEmail}`);
    if (passengerAddress) {
      doc.text(`Address: ${passengerAddress}`);
    }
    doc.moveDown();

    // Flight Details
    doc.fontSize(14).text('Flight Details:', { underline: true });
    doc.fontSize(12).text(`Airline: ${airline}`);
    doc.text(`Flight Number: ${flightNumber}`);
    doc.text(`PNR: ${pnr}`);
    doc.text(`Flight Date: ${new Date(flightDate).toLocaleDateString('en-IN')}`);
    doc.text(`Route: ${departureAirport} to ${arrivalAirport}`);
    doc.moveDown();

    // Issue Details
    doc.fontSize(14).text('Issue Details:', { underline: true });
    doc.fontSize(12).text(`Type: ${issueType}`);
    doc.moveDown();
    doc.text('Description:');
    doc.moveDown(0.5);
    doc.text(issueDescription, {
      width: 500,
      align: 'justify'
    });
    doc.moveDown();

    // Compensation Request
    if (compensationAmount) {
      doc.fontSize(14).text('Compensation Requested:', { underline: true });
      doc.fontSize(12).text(`Amount: ₹${compensationAmount.toLocaleString('en-IN')}`);
      doc.moveDown();
    }

    // Supporting Documents
    if (supportingDocs.length > 0) {
      doc.fontSize(14).text('Supporting Documents:', { underline: true });
      supportingDocs.forEach((docItem, index) => {
        doc.fontSize(12).text(`${index + 1}. ${docItem.type}: ${docItem.description}`);
      });
      doc.moveDown();
    }

    // Legal References
    doc.fontSize(14).text('Legal References:', { underline: true });
    doc.fontSize(12).text('• DGCA Civil Aviation Requirements Section 3, Series M, Part IV');
    doc.text('• Montreal Convention 1999 (for international flights)');
    doc.text('• Airline\'s Conditions of Carriage');
    doc.moveDown();

    // Footer with disclaimer
    doc.fontSize(10).text(
      'Disclaimer: This letter is generated for informational purposes only. ' +
      'It is not legal advice. Consult with a legal professional for specific guidance.',
      {
        align: 'center',
        color: 'red'
      }
    );

    // Finalize PDF
    doc.end();
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaint email text
 */
exports.getComplaintEmailText = async (req, res, next) => {
  try {
    const complaintData = req.body;
    
    const emailTemplate = `
Subject: Formal Complaint Regarding ${complaintData.airline} Flight ${complaintData.flightNumber}

To: ${complaintData.airline} Customer Relations

Dear Sir/Madam,

I am writing to formally complain about my recent flight experience with ${complaintData.airline}.

**Passenger Details:**
Name: ${complaintData.passengerName}
Email: ${complaintData.passengerEmail}
${complaintData.pnr ? `PNR: ${complaintData.pnr}` : ''}

**Flight Details:**
Flight Number: ${complaintData.flightNumber}
Date: ${new Date(complaintData.flightDate).toLocaleDateString('en-IN')}
Route: ${complaintData.departureAirport} to ${complaintData.arrivalAirport}

**Issue:**
Type: ${complaintData.issueType}

Description:
${complaintData.issueDescription}

**Compensation Requested:**
${complaintData.compensationAmount ? `Amount: ₹${complaintData.compensationAmount.toLocaleString('en-IN')}` : 'As per applicable regulations'}

**Supporting Documents:**
${complaintData.supportingDocs?.map(doc => `• ${doc.type}: ${doc.description}`).join('\n') || 'Attached separately'}

**Legal Basis:**
This complaint is made with reference to:
1. DGCA Civil Aviation Requirements Section 3, Series M, Part IV
2. Montreal Convention 1999 (for international flights)
3. ${complaintData.airline}'s published Conditions of Carriage

I expect a response within 30 days as per regulatory requirements.

Sincerely,
${complaintData.passengerName}
${complaintData.passengerEmail}

---
Generated via Airport Passenger Rights Platform
This is not legal advice. Consult a legal professional for specific guidance.
`;

    res.json({
      emailText: emailTemplate,
      subject: `Formal Complaint Regarding ${complaintData.airline} Flight ${complaintData.flightNumber}`,
      toEmail: 'customer.relations@' + complaintData.airline.toLowerCase().replace(/\s+/g, '') + '.com'
    });
  } catch (error) {
    next(error);
  }
};