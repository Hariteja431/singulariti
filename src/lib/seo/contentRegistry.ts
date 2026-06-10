export interface ToolSEOContent {
  h2Title: string;
  introduction: string[];
  features: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  howToSteps?: { name: string; text: string }[];
}

export const seoContentRegistry: Record<string, ToolSEOContent> = {
  "compress-pdf": {
    h2Title: "How to Compress PDF Files Online Without Losing Quality",
    introduction: [
      "Large PDF files can be a hassle to email, upload to portals, or share with colleagues. Our free online PDF compressor allows you to drastically reduce the file size of your documents without sacrificing readability or print quality.",
      "Unlike other tools that force you to upload your confidential and sensitive documents to a remote server, Singulariti processes your PDF entirely within your own web browser. This means zero upload times, no file size limits, and 100% guaranteed privacy. Your files never leave your device."
    ],
    features: [
      {
        title: "Client-Side Compression",
        description: "Your PDF is parsed and compressed entirely using your browser's local resources. We do not store, view, or upload your data."
      },
      {
        title: "Maintain Formatting & Quality",
        description: "Our advanced compression algorithm strips out unnecessary metadata, embedded fonts, and unreferenced objects while keeping your text sharp and images clear."
      },
      {
        title: "Perfect for Email Attachments",
        description: "Shrink massive 50MB documents down to under 5MB in seconds so they easily fit within Gmail or Outlook attachment limits."
      }
    ],
    howToSteps: [
      { name: "Select File", text: "Click the upload area or drag and drop your heavy PDF file into the dropzone." },
      { name: "Choose Compression", text: "Select your desired compression level (Recommended is best for most documents)." },
      { name: "Download", text: "Click Compress and instantly download your lightweight PDF file." }
    ],
    faqs: [
      {
        question: "Is it safe to compress confidential PDF documents online?",
        answer: "Yes, it is completely safe with Singulariti. Unlike traditional cloud-based compressors, we use local browser processing. Your confidential documents are never uploaded to our servers, ensuring total privacy."
      },
      {
        question: "How do I reduce a PDF file size for email?",
        answer: "Simply upload your document to our tool, select the 'Recommended' compression setting, and hit compress. We will strip unnecessary background data and shrink images to make the file small enough for email attachments."
      },
      {
        question: "Will compressing a PDF reduce its print quality?",
        answer: "Our standard compression levels are optimized for screen viewing and standard printing. Text will remain razor-sharp. If you have extremely high-resolution print images, you may notice a slight downgrade in DPI, but the document will remain highly readable."
      },
      {
        question: "Is there a file size limit for the compressor?",
        answer: "Because we rely on your device's memory rather than a remote server, there is no strict upload limit. You can compress very large PDFs as long as your browser and computer have enough RAM to process it."
      }
    ]
  },
  "image-compressor": {
    h2Title: "The Best Free Image Compressor for Web & Storage",
    introduction: [
      "High-resolution photos are beautiful, but they consume massive amounts of storage space and severely slow down website loading speeds. Our free online image compressor allows you to instantly reduce the file size of JPG, PNG, and WebP images by up to 80% with almost no visible loss in quality.",
      "Because we utilize local browser compression technology, you can compress hundreds of images securely without waiting for tedious server uploads. Optimize your digital assets for faster SEO performance, easier sharing, and optimized storage."
    ],
    features: [
      {
        title: "Zero Server Uploads",
        description: "All image compression happens instantly on your own device. We never see, store, or harvest your personal photos."
      },
      {
        title: "Smart Lossy & Lossless Algorithms",
        description: "Choose exactly how much compression you need. Our engine perfectly balances visual fidelity with massive file size reduction."
      },
      {
        title: "Cross-Format Support",
        description: "Whether you need to shrink a massive PNG screenshot or optimize a high-res JPEG photograph from your camera, we support all major formats."
      }
    ],
    howToSteps: [
      { name: "Upload Image", text: "Drag and drop your heavy photos directly into the browser window." },
      { name: "Adjust Quality", text: "Use the slider to set your desired quality percentage (80% is usually the sweet spot)." },
      { name: "Save", text: "Download the drastically smaller image file instantly." }
    ],
    faqs: [
      {
        question: "How does image compression work without losing quality?",
        answer: "Our tool uses smart 'lossy' compression algorithms. It analyzes the image and selectively reduces the color palette and removes metadata that the human eye can't perceive. The result is an image that looks virtually identical but requires a fraction of the storage space."
      },
      {
        question: "How can I reduce an image file size to a specific KB?",
        answer: "While we don't have a strict 'target KB' input, you can use the interactive quality slider. Dragging the slider lower will progressively reduce the KB size. You can see the estimated output size in real-time before downloading."
      },
      {
        question: "Is this image compressor really free?",
        answer: "Yes, it is 100% free with no hidden fees, no watermarks, and no daily limits. Because you provide the processing power locally through your browser, we don't have to pay expensive server costs."
      },
      {
        question: "Will compressing photos strip EXIF data?",
        answer: "Yes, to achieve the maximum possible file size reduction, our compressor automatically removes non-essential EXIF metadata (like camera model and GPS coordinates)."
      }
    ]
  },
  "url-qr-code-generator": {
    h2Title: "Free Custom URL QR Code Generator",
    introduction: [
      "Instantly turn any website link into a scannable QR code. Our free online URL QR code generator is perfect for marketing materials, business cards, restaurant menus, and event posters.",
      "Customise your QR code with logos, brand colors, and unique shapes. The code is generated instantly in your browser without any sign-up required, and unlike dynamic QR codes from other providers, our static codes never expire and have no scan limits."
    ],
    features: [
      {
        title: "Never Expires",
        description: "Our static QR codes are permanent. Once you generate and download it, it will work forever with no scan limits or hidden subscription fees."
      },
      {
        title: "Custom Branding & Logos",
        description: "Make the QR code your own. Upload your brand logo to place in the center, and change the dot colors and eye shapes to match your marketing materials."
      },
      {
        title: "High-Resolution Export",
        description: "Download your custom QR code in high-quality PNG or SVG formats, ensuring it stays perfectly sharp when printed on large banners or small business cards."
      }
    ],
    howToSteps: [
      { name: "Enter Link", text: "Paste the full website URL (including https://) into the input field." },
      { name: "Customize", text: "Change the colors, upload a logo, and adjust the corner shapes to fit your brand." },
      { name: "Download", text: "Test the code with your phone camera, then download it as a PNG or SVG file." }
    ],
    faqs: [
      {
        question: "Do these QR codes ever expire?",
        answer: "No, they never expire. We generate static QR codes, meaning the destination URL is permanently encoded directly into the pattern. They will continue to work forever, completely free of charge."
      },
      {
        question: "Is there a limit to how many times the QR code can be scanned?",
        answer: "There are absolutely zero scan limits. Your users can scan the QR code millions of times without you ever hitting a paywall."
      },
      {
        question: "Can I track how many people scan my QR code?",
        answer: "Because our generator creates static QR codes for maximum privacy and zero expiration, we do not track scans. The code goes directly to your website without passing through a tracking redirect."
      },
      {
        question: "Why isn't my QR code scanning?",
        answer: "If your QR code isn't scanning, ensure there is high contrast between the dot color (which should be dark) and the background color (which should be light). Also, make sure the destination URL is correct and the logo in the center isn't too large."
      }
    ]
  }
};
