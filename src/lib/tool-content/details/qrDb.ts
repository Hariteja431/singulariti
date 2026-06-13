// Tool Details Database for qr category
export interface ToolDetailEntry {
  whyNeed: string;
  howWorks: string;
  whenToUse: string;
  stepByStep: string[];
  advantages: string[];
  commonMistakes: string[];
  faqs: { q: string; a: string }[];
}

export const qrDetailsDb: Record<string, ToolDetailEntry> = {
  "qr-code-generator": {
    whyNeed: "Sharing links or text manually leads to spelling errors. QR codes allow quick scanning.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine compiles text strings into matrix grids with Reed-Solomon error correction and exports SVGs for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **QR Code Generator** when you need to generate custom, styled QR codes during printing codes for flyers, generating app download links, and business card setups.",
    stepByStep: ["Type or paste your link/text into the generator.","Adjust styling settings (colors, block sizes).","Download the vector SVG or PNG QR code."],
    advantages: ["Exports vector SVG graphics for sharp printing","Includes adjustable error correction levels","Generates permanent static codes"],
    commonMistakes: ["Generating low-contrast codes that are hard for cameras to scan"],
    faqs: [{"q":"Do these QR codes expire?","a":"No. These are static codes containing data directly; they function permanently without expiration."}]
  },
  "qr-code-scanner": {
    whyNeed: "You often need to decode QR codes from screenshots, files, or using a laptop camera.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies image binarization and pattern recognition client-side to locate and decode codes for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **QR Code Scanner** when you need to scan and decode QR codes from camera feeds or files during decoding QR codes from invoice images, scanning links, and testing print graphics.",
    stepByStep: ["Upload a QR code image file or enable your camera feed.","Hold the QR code up to the scanner.","Copy the decoded link or text output."],
    advantages: ["Decodes from both camera feeds and image files","Runs locally in browser memory for secure scans","Works offline instantly"],
    commonMistakes: ["Scanning highly blurred or low-contrast images"],
    faqs: [{"q":"Is my camera feed private?","a":"Yes. The camera feed is processed in real-time in your browser memory; no video is ever sent to a server."}]
  },
  "url-qr-code-generator": {
    whyNeed: "Typing long URL paths on smartphones is frustrating and error-prone.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine encodes URL strings into QR code matrix grids for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **URL QR Code Generator** when you need to convert website addresses into scannable QR codes during sharing menus, linking product landing pages, and linking portfolios.",
    stepByStep: ["Enter the destination website URL.","Select color and dot size parameters.","Save the generated QR code graphic."],
    advantages: ["Specifically optimized for web links and URLs","Exports sharp vector SVG paths","Runs offline client-side"],
    commonMistakes: ["Entering broken or incorrect URLs that direct users to 404 pages"],
    faqs: [{"q":"Can I change the URL later?","a":"No, these are static codes. To change the link, you must generate a new QR code."}]
  },
  "text-qr-code-generator": {
    whyNeed: "Sharing passwords, instructions, or codes physically requires a quick scanner.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine encodes text characters into QR matrix grids for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Text QR Code Generator** when you need to convert plain text messages into scannable QR codes during sharing Wi-Fi keys, printing instruction blocks, and writing secure messages.",
    stepByStep: ["Type your message into the text area.","Set block padding and color layouts.","Download the scannable code image."],
    advantages: ["Encodes plain text sentences easily","Supports large character sets","Processed client-side safely"],
    commonMistakes: ["Packing too much text, which makes the QR dots tiny and hard to scan"],
    faqs: [{"q":"How much text can I fit?","a":"We recommend keeping text under 300 characters to ensure fast scanning on all phone models."}]
  },
  "wifi-qr-code-generator": {
    whyNeed: "Dictating long, complex Wi-Fi passwords to office visitors is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine encodes Wi-Fi format tags `WIFI:S:SSID;T:WPA;P:PASSWORD;;` into QR grids for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Wi-Fi QR Code Generator** when you need to create scannable QR codes containing Wi-Fi access credentials during sharing customer Wi-Fi networks in cafes, restaurants, and offices.",
    stepByStep: ["Enter the Wi-Fi network SSID (name).","Type the password and select the security protocol (WPA/WEP).","Generate and download the scannable code."],
    advantages: ["Formats standard Wi-Fi connect strings automatically","Generates permanent connect codes","Runs locally in browser RAM"],
    commonMistakes: ["Entering wrong Wi-Fi security protocols, which blocks connections"],
    faqs: [{"q":"Do users need an app to scan?","a":"No, standard smartphone cameras will scan the code and connect to Wi-Fi automatically."}]
  },
  "vcard-qr-code-generator": {
    whyNeed: "Sharing phone numbers, emails, and office locations verbally takes time and leads to spelling errors.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine encodes standardized vCard contact strings into QR code grids for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **vCard QR Code Generator** when you need to generate contact-sharing vCard QR codes during printing contact QR codes on business cards and sharing contact cards physically.",
    stepByStep: ["Fill in name, phone, email, and company details.","Click generate to encode the vCard structure.","Save and print the QR code."],
    advantages: ["Formats standard vCard structure for instant contact import","Works on business cards","100% secure client-side execution"],
    commonMistakes: ["Adding too many details, making the QR grid extremely dense"],
    faqs: [{"q":"Does this open a contact card on phones?","a":"Yes. Scanning the code prompts the phone's address book to add the contact details."}]
  },
  "email-qr-code-generator": {
    whyNeed: "Allowing users to send emails with pre-filled support subjects and body templates increases conversion.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine encodes standard mailto schemas into QR grids for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Email QR Code Generator** when you need to generate email-initiating QR codes during sharing support links, setting up RSVP emails, and collecting feedback.",
    stepByStep: ["Enter recipient email address.","Type the pre-filled subject line and message body.","Download the scannable email QR code."],
    advantages: ["Pre-fills support subject and message parameters","Launches mail client instantly on scan","Processes locally securely"],
    commonMistakes: ["Entering invalid email formats"],
    faqs: [{"q":"What happens on scan?","a":"Scanning the code launches the user's default email app (like Mail, Outlook) with your values pre-filled."}]
  },
  "phone-number-qr-code-generator": {
    whyNeed: "Typing business hotline numbers from billboards is slow.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine encodes tel protocols into QR grids for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Phone Number QR Code Generator** when you need to generate dialer-initiating QR codes during printing hotlines on billboards, contact flyers, and brochures.",
    stepByStep: ["Enter the phone number with country code.","Generate the code and download the SVG/PNG file.","Print the dialer code."],
    advantages: ["Formats direct tel links","Quick phone dialer launch on scan","Runs client-side securely"],
    commonMistakes: ["Forgetting country codes, which might cause wrong dialing"],
    faqs: [{"q":"Does it make the phone call automatically?","a":"No, it opens the phone dialer pre-loaded with the number, and the user must tap call."}]
  },
  "sms-qr-code-generator": {
    whyNeed: "Collecting SMS alerts or coupon codes manually is frustrating.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine encodes sms protocols into QR grids for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **SMS QR Code Generator** when you need to generate SMS-initiating QR codes during subscribing users to SMS channels and printing coupon alerts.",
    stepByStep: ["Enter recipient mobile number.","Type the pre-loaded SMS message body.","Generate and save the code."],
    advantages: ["Launches SMS messenger with pre-filled values","Runs offline in browser cache","No limits or logs"],
    commonMistakes: ["Pasting messages that are too long for standard SMS packages"],
    faqs: [{"q":"Does it send the SMS automatically?","a":"No, it opens the phone's SMS app, and the user must press the send button."}]
  },
  "upi-qr-code-generator": {
    whyNeed: "Typing merchant virtual addresses (VPA) manually leads to failed or wrong transfers.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine encodes standardized UPI payment strings containing merchant IDs and amounts client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **UPI QR Code Generator** when you need to generate secure UPI payment QR codes during printing payment boards for retail shops, invoices, and billing counters.",
    stepByStep: ["Enter your merchant UPI VPA ID (e.g. name@upi).","Specify merchant name and optional payment amount.","Save the payment QR code."],
    advantages: ["Formats standardized UPI payment links","Allows locking custom billing amounts","Runs locally on your CPU for secure parameters"],
    commonMistakes: ["Entering an incorrect UPI VPA ID, which routes payments to the wrong user"],
    faqs: [{"q":"Which apps can scan this code?","a":"Any UPI-enabled app (like Google Pay, PhonePe, Paytm, BHIM) can scan the code to complete payments."}]
  }
};
