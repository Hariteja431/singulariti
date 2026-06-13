// Tool Details Database for pdf category
export interface ToolDetailEntry {
  whyNeed: string;
  howWorks: string;
  whenToUse: string;
  stepByStep: string[];
  advantages: string[];
  commonMistakes: string[];
  faqs: { q: string; a: string }[];
}

export const pdfDetailsDb: Record<string, ToolDetailEntry> = {
  "merge-pdf": {
    whyNeed: "Managing dozens of separate receipts or invoices is chaotic; merging them makes folders organized.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine parses multiple PDF binary buffers and stitches their page dictionaries together client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Merge PDF** when you need to combine multiple PDF documents into a single file during combining invoice logs, gathering homework sheets, and compiling portfolio chapters.",
    stepByStep: ["Select and upload multiple PDF files.","Drag and drop files to set the page order.","Click merge and download the unified PDF."],
    advantages: ["Maintains document hyperlink and outline catalogs","Supports merging dozens of files at once","Runs locally on your CPU for secure files"],
    commonMistakes: ["Attempting to merge encrypted PDFs without entering passwords first"],
    faqs: [{"q":"Is there a file count limit?","a":"No, but merging massive files is limited by your browser tab's RAM. Keep totals under 200MB for smooth operation."}]
  },
  "split-pdf": {
    whyNeed: "Sending a heavy 100-page corporate report is slow when you only need to share a single chapter.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine extracts selected page directories and writes them into separate PDF files for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Split PDF** when you need to divide a PDF into separate files by page ranges during extracting tax chapters, splitting book segments, and dividing invoice logs.",
    stepByStep: ["Upload your PDF document.","Enter target page ranges (e.g. '1-3, 5-8').","Click split and download the resulting files."],
    advantages: ["Splits files by exact page ranges","Maintains original document styling and vectors","Processed client-side safely"],
    commonMistakes: ["Typing incorrect page formats (e.g., entering letters instead of number indexes)"],
    faqs: [{"q":"Does this reduce page resolution?","a":"No. The pages are extracted as vector assets; no quality loss occurs."}]
  },
  "rotate-pdf": {
    whyNeed: "Sideways scans are impossible to read or present professionally.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine updates the rotation metadata flags in the PDF catalog structure for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Rotate PDF** when you need to rotate PDF document pages by 90, 180, or 270 degrees during correcting sideways scans, turning landscape charts, and preparing files.",
    stepByStep: ["Upload your PDF document.","Select specific pages to rotate, and click rotation angles.","Download the rotated PDF."],
    advantages: ["Reorients pages without re-compressing vectors, keeping layout sharp","Rotates individual pages or the entire document","Runs offline client-side"],
    commonMistakes: ["Forgetting to save rotations before clicking download"],
    faqs: [{"q":"Will the text remain selectable?","a":"Yes, since the tool only rotates page orientation tags rather than flat raster images, text remains selectable."}]
  },
  "delete-pdf-pages": {
    whyNeed: "Draft agreements often contain empty pages or obsolete clauses that need removal.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine filters out unwanted page indices from the document catalog tree for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Delete PDF Pages** when you need to remove selected pages from PDF documents during purging empty layout pages, removing outdated contract slides, and cleaning documents.",
    stepByStep: ["Select and upload your PDF file.","Click on page thumbnails to select pages for deletion.","Save the cleaned PDF document."],
    advantages: ["Visual thumbnail preview makes page selection easy","Purges pages in seconds in-memory","100% secure client-side execution"],
    commonMistakes: ["Deleting wrong page pages and not keeping a backup copy"],
    faqs: [{"q":"Can I recover deleted pages?","a":"Once downloaded, pages are removed. Make sure to keep your original file as a backup."}]
  },
  "rearrange-pdf-pages": {
    whyNeed: "Scanned pages are often compiled out-of-order, creating confusing reading layouts.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine rearranges the page index arrays in the PDF tree structure for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Rearrange PDF Pages** when you need to reorder the pages of a PDF document during fixing scanned page orders, re-ordering slides, and organizing essays.",
    stepByStep: ["Upload the PDF document.","Drag and drop page thumbnails to set the order.","Click rearrange to save the new document order."],
    advantages: ["Visual drag-and-drop page sorting","Processes PDF layouts instantly","Runs locally in browser RAM"],
    commonMistakes: ["Dropping pages in incorrect positions without checking page numbers"],
    faqs: [{"q":"Does it work for large PDFs?","a":"Yes, but rendering dozens of thumbnails requires browser memory. Keep files under 100 pages for best speed."}]
  },
  "extract-pdf-pages": {
    whyNeed: "You often need to save only the signature page or summary charts from a heavy document.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine copies selected page references into a new PDF document container for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Extract PDF Pages** when you need to extract specific pages from a PDF document during saving signature pages, extracting charts, and separating statements.",
    stepByStep: ["Upload your PDF file.","Select target page numbers visually or enter ranges.","Extract and download the new document."],
    advantages: ["Extracts pages cleanly into a new lightweight PDF","Preserves interactive forms and select text","Runs client-side for safety"],
    commonMistakes: ["Extracting empty ranges or invalid page indexes"],
    faqs: [{"q":"Does it extract images?","a":"It extracts the entire page layout; if you want to extract images only, use the PDF Image Extractor tool."}]
  },
  "jpg-to-pdf": {
    whyNeed: "Portals require scanned document pages to be uploaded as a single PDF rather than separate image files.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine renders image frames onto PDF coordinate planes and packages them into a document for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **JPG to PDF** when you need to convert JPG images into a single PDF document during combining passport photos, scanning receipts, and packaging portfolios.",
    stepByStep: ["Upload one or more JPG images.","Set page layout preferences (margins, orientation).","Convert and download the unified PDF document."],
    advantages: ["Packs multiple photos into a single structured PDF","Maintains original image resolution","Processed locally for secure documents"],
    commonMistakes: ["Adding heavy images, which makes the output PDF file extremely large"],
    faqs: [{"q":"Can I adjust margins?","a":"Yes, you can configure margin sizes and fit orientations before conversion."}]
  },
  "pdf-to-jpg": {
    whyNeed: "Sharing specific PDF charts or slides on social channels or presentations requires image formats.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine rasterizes PDF pages using browser canvas rendering engines (pdf.js) for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **PDF to JPG** when you need to convert PDF document pages into high-resolution JPG images during posting document charts, converting presentations to slides, and viewing files on mobile.",
    stepByStep: ["Upload the PDF document.","Select resolution scaling quality.","Convert and download pages as a ZIP folder of JPG images."],
    advantages: ["Rasterizes PDF vectors to sharp, high-res JPGs","Downloads all pages grouped in a ZIP package","Executes locally in browser memory"],
    commonMistakes: ["Expecting converted JPG text to remain selectable (images are flat pixels)"],
    faqs: [{"q":"Does this support multi-page PDFs?","a":"Yes. Every page is converted into a separate JPG file."}]
  },
  "compress-pdf": {
    whyNeed: "PDF documents with many images are often too heavy for email attachments and portal upload limits.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine compresses embedded images and downscales vector resolutions client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Compress PDF** when you need to optimize and reduce PDF file sizes during shrinking portfolios, compressing scanned reports, and meeting email limits.",
    stepByStep: ["Upload your heavy PDF file.","Select compression density settings.","Save the optimized, lightweight PDF."],
    advantages: ["Reduces PDF weight while preserving readable text layouts","Strips unneeded metadata and structures","100% secure client-side execution"],
    commonMistakes: ["Compressing already optimized PDFs, which may degrade image quality without saving space"],
    faqs: [{"q":"Will the text quality degrade?","a":"No. The compressor targets image assets inside the PDF; vector text lines remain perfectly sharp."}]
  },
  "sign-pdf": {
    whyNeed: "Printing, signing, and scanning contracts manually is slow and wastes paper.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine draws signature lines or overlays signature images onto PDF layouts in browser for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Sign PDF** when you need to place digital signatures onto PDF pages during signing rental agreements, signing client contracts, and marking reports.",
    stepByStep: ["Upload your PDF contract document.","Draw your signature or upload a transparent signature image.","Place and scale the signature on the page, then save."],
    advantages: ["Draw or upload signature layers easily","Supports placing signatures on multiple page locations","Runs locally in browser RAM for maximum security"],
    commonMistakes: ["Forgetting that standard digital overlays are not cryptographically binding certificates"],
    faqs: [{"q":"Is this signature legally binding?","a":"It is a standard visual signature overlay. For official or corporate audits, verify whether your portal accepts scanned/drawn signatures."}]
  },
  "watermark-pdf": {
    whyNeed: "Preventing unauthorized copying of draft publications or contract agreements requires clear watermarks.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine renders overlay layers on PDF page canvas coordinates client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Add Watermark to PDF** when you need to add text or image watermarks to PDF pages during watermarking draft manuscripts, branding reports, and protecting statements.",
    stepByStep: ["Upload your PDF file.","Type your watermark text or select a watermark logo image.","Set opacity, rotation, and save the watermarked PDF."],
    advantages: ["Supports both custom text and logo graphic watermarks","Adjustable opacity and rotation parameters","Zero server uploads"],
    commonMistakes: ["Watermarking over critical text, making the document hard to read"],
    faqs: [{"q":"Can the watermark cover all pages?","a":"Yes, you can choose to apply the watermark to all pages or specific page ranges."}]
  },
  "protect-pdf": {
    whyNeed: "Sharing confidential bank statements, tax records, or legal contracts over email poses interception risks.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine encrypts PDF binary streams with passwords using browser encryption libraries for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Protect PDF** when you need to encrypt and password-protect PDF files during encrypting tax statements, locking legal files, and protecting personal details.",
    stepByStep: ["Select the PDF file to encrypt.","Type a secure password in the input field.","Set document permission flags (e.g., block printing or copying).","Save the encrypted, locked PDF."],
    advantages: ["Locks files with standard PDF encryption","Allows setting custom user permissions","Runs client-side securely"],
    commonMistakes: ["Forgetting the password, as encrypted files cannot be recovered without it"],
    faqs: [{"q":"Can I block printing?","a":"Yes, you can toggle permissions to restrict printing, editing, and copying of your PDF content."}]
  },
  "metadata-viewer": {
    whyNeed: "PDFs contain hidden creation dates, author names, and software footprints that you may want to check.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine parses the metadata catalog dictionary of PDF files in the browser for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **PDF Metadata Viewer** when you need to inspect hidden metadata inside PDF files during verifying document author details, auditing file edit dates, and checking metadata sizes.",
    stepByStep: ["Upload your PDF document.","Inspect the parsed metadata table showing author, creator, creation date, and software.","Verify the document statistics."],
    advantages: ["Extracts creation dates, author fields, and software details","Processed on-device in browser memory","Simple table overview"],
    commonMistakes: ["Expecting metadata from files that have been explicitly stripped of catalog details"],
    faqs: [{"q":"Can I edit the metadata?","a":"This tool is a viewer; to edit metadata, search for dedicated PDF editors."}]
  },
  "page-counter": {
    whyNeed: "Manually opening and counting pages of dozens of PDFs to calculate print totals is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine reads the page catalog index count of uploaded PDF documents for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **PDF Page Counter** when you need to count pages of multiple PDF documents during estimating printing costs, auditing document lengths, and sorting invoice packets.",
    stepByStep: ["Upload one or more PDF files.","Review the total page count calculated for each file and the grand total.","Check document summaries."],
    advantages: ["Counts pages of multiple PDFs simultaneously","Calculates total sheets needed for printing","Runs locally in browser RAM"],
    commonMistakes: ["Uploading corrupted PDFs that cannot be parsed by the browser"],
    faqs: [{"q":"Are my files uploaded to count them?","a":"No, the parsing code runs entirely inside your browser tab."}]
  },
  "pdf-to-text": {
    whyNeed: "Copying text content from a heavy PDF document page-by-page is slow and tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine extracts text character vectors from PDF page streams using client-side parsers for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **PDF to Text** when you need to extract selectable text from PDF documents during copying content from ebooks, extracting reports, and analyzing text dumps.",
    stepByStep: ["Upload your PDF file.","Wait for the text extraction to complete locally.","Copy the extracted text to your clipboard or save it as a text file."],
    advantages: ["Extracts text from all document pages quickly","Runs entirely client-side, keeping data secure","No account required"],
    commonMistakes: ["Extracting text from scanned image PDFs; this tool works on native digital vector PDFs"],
    faqs: [{"q":"Can it extract text from scanned images?","a":"This tool extracts selectable digital text. For scanned paper documents, OCR (Optical Character Recognition) is required."}]
  }
};
