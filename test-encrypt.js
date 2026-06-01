const { encryptPdf } = require('@pdfsmaller/pdf-encrypt-lite');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function run() {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText('This is a protected document!');
    const pdfBytes = await pdfDoc.save();
    
    // Test encryption
    console.log('Testing encryption...');
    // I need to guess the API based on common patterns, wait, I can just read its index.js or package docs.
  } catch (e) {
    console.error(e);
  }
}

run();
