const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]); // landscape page
  
  // Draw a background color (light blue)
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 600,
    height: 400,
    color: rgb(0.9, 0.95, 1.0),
  });

  // Draw a border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: 560,
    height: 360,
    borderColor: rgb(0.0, 0.5, 0.5),
    borderWidth: 5,
  });

  // Add some text
  page.drawText('TEST CERTIFICATE PDF', {
    x: 150,
    y: 200,
    size: 30,
    color: rgb(0, 0.2, 0.4),
  });

  page.drawText('This is a test PDF to verify the upload and preview logic.', {
    x: 100,
    y: 150,
    size: 14,
    color: rgb(0.2, 0.2, 0.2),
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, 'test_certificate.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('PDF created successfully at:', outputPath);
}

createPdf().catch(err => console.error(err));
