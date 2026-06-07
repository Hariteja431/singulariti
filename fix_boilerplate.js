const fs = require('fs');

const rewrites = {
  "image-compressor": {
    "title": "Compress Image Online Free – Reduce Image File Size",
    "desc": "Reduce image file sizes instantly without losing visible quality. Upload your image, choose your compression level, and download — all processed safely in your browser."
  },
  "jpg-compressor": {
    "title": "Compress JPG Online Free – Reduce File Size Without Quality Loss",
    "desc": "Reduce JPG file sizes instantly without losing visible quality. Upload your JPG, choose your compression level, and download — all processed safely in your browser."
  },
  "jpeg-compressor": {
    "title": "Compress JPEG Online Free – Reduce File Size Instantly",
    "desc": "Reduce JPEG file sizes instantly without losing visible quality. Upload your JPEG, choose your compression level, and download — all processed safely in your browser."
  },
  "png-compressor": {
    "title": "Compress PNG Online Free – Reduce File Size Safely",
    "desc": "Reduce PNG file sizes instantly without losing visible quality. Upload your PNG, choose your compression level, and download — all processed safely in your browser."
  },
  "webp-compressor": {
    "title": "Compress WebP Online Free – Reduce File Size Easily",
    "desc": "Reduce WebP file sizes instantly without losing visible quality. Upload your WebP, choose your compression level, and download — all processed safely in your browser."
  },
  "svg-compressor": {
    "title": "Compress SVG Online Free – Optimize Vector Graphics",
    "desc": "Optimize SVG files by removing unnecessary metadata and whitespace. Drag and drop your SVG to get a smaller, cleaner file instantly without sending files to any server."
  },
  "jpg-to-png": {
    "title": "Convert JPG to PNG Online – Free Browser Image Converter",
    "desc": "Easily convert standard JPG images to the transparent PNG format. Fast, free, and processed entirely within your web browser."
  },
  "png-to-jpg": {
    "title": "Convert PNG to JPG Online – Free Browser Image Converter",
    "desc": "Easily convert transparent or large PNG images to the universally accepted JPG format. Fast, free, and processed entirely within your web browser."
  },
  "jpg-to-webp": {
    "title": "Convert JPG to WebP Online – Free Browser Image Converter",
    "desc": "Easily convert standard JPG images to the next-gen WebP format. Fast, free, and processed entirely within your web browser."
  },
  "png-to-webp": {
    "title": "Convert PNG to WebP Online – Free Browser Image Converter",
    "desc": "Easily convert transparent PNG images to the highly compressed WebP format. Fast, free, and processed entirely within your web browser."
  },
  "webp-to-jpg": {
    "title": "Convert WebP to JPG Online – Free Browser Image Converter",
    "desc": "Easily convert next-gen WebP images to the universally accepted JPG format. Fast, free, and processed entirely within your web browser."
  },
  "webp-to-png": {
    "title": "Convert WebP to PNG Online – Free Browser Image Converter",
    "desc": "Easily convert next-gen WebP images to the transparent PNG format. Fast, free, and processed entirely within your web browser."
  },
  "jpg-to-jpeg": {
    "title": "Convert JPG to JPEG Online – Free Browser Image Converter",
    "desc": "Easily convert JPG images to the JPEG extension format. Fast, free, and processed entirely within your web browser."
  },
  "jpeg-to-jpg": {
    "title": "Convert JPEG to JPG Online – Free Browser Image Converter",
    "desc": "Easily convert JPEG images to the standard JPG extension format. Fast, free, and processed entirely within your web browser."
  },
  "svg-to-png": {
    "title": "Convert SVG to PNG Online – Free Browser Image Converter",
    "desc": "Easily convert scalable SVG vectors to the transparent PNG raster format. Fast, free, and processed entirely within your web browser."
  },
  "svg-to-jpg": {
    "title": "Convert SVG to JPG Online – Free Browser Image Converter",
    "desc": "Easily convert scalable SVG vectors to the universally accepted JPG format. Fast, free, and processed entirely within your web browser."
  },
  "svg-to-webp": {
    "title": "Convert SVG to WebP Online – Free Browser Image Converter",
    "desc": "Easily convert scalable SVG vectors to the next-gen WebP format. Fast, free, and processed entirely within your web browser."
  },
  "png-to-svg": {
    "title": "Convert PNG to SVG Online – Free Browser Image Converter",
    "desc": "Easily convert transparent PNG images to scalable SVG vectors. Fast, free, and processed entirely within your web browser."
  },
  "jpg-to-svg": {
    "title": "Convert JPG to SVG Online – Free Browser Image Converter",
    "desc": "Easily convert standard JPG images to scalable SVG vectors. Fast, free, and processed entirely within your web browser."
  },
  "webp-to-svg": {
    "title": "Convert WebP to SVG Online – Free Browser Image Converter",
    "desc": "Easily convert next-gen WebP images to scalable SVG vectors. Fast, free, and processed entirely within your web browser."
  },
  "image-metadata-viewer": {
    "title": "Image Metadata Viewer Online – Read EXIF Data Free",
    "desc": "Extract and read hidden EXIF data from your photos instantly. Upload an image to view camera settings, location data, and date taken with zero privacy risk."
  },
  "image-dimension-checker": {
    "title": "Image Dimension Checker Online – Find Image Size Free",
    "desc": "Check the exact pixel dimensions and aspect ratio of your image instantly. Upload a photo to see its width and height directly in your browser."
  },
  "image-format-detector": {
    "title": "Image Format Detector Online – Identify Image Types Free",
    "desc": "Determine the true file format of an image instantly. Upload a file to see its MIME type and extension directly in your browser without any server uploads."
  },
  "color-picker-from-image": {
    "title": "Color Picker From Image Online – Extract Colors Free",
    "desc": "Extract HEX and RGB colors directly from your images. Upload a photo and use the eyedropper tool to pick any color instantly in your browser."
  },
  "image-color-palette-extractor": {
    "title": "Image Color Palette Extractor Online – Generate Palettes",
    "desc": "Automatically extract the dominant color palette from your images. Upload a photo to generate beautiful color schemes instantly without sending files to a server."
  },
  "image-to-base64": {
    "title": "Image to Base64 Converter Online – Free Developer Tool",
    "desc": "Convert images to Base64 encoded strings for direct CSS or HTML embedding. Drag and drop your image to get the data URL instantly without any server uploads."
  },
  "base64-to-image": {
    "title": "Base64 to Image Decoder Online – Free Developer Tool",
    "desc": "Decode Base64 strings back into viewable and downloadable images. Paste your Base64 text to get the original image instantly without any server uploads."
  }
};

let content = fs.readFileSync('src/lib/seo/utilityMetadata.ts', 'utf8');

// There are more tools to rewrite. We need to find them.
const regex = /"utilityId":\s*"([^"]+)"([\s\S]*?)"title":\s*"([^"]+)"([\s\S]*?)"description":\s*"(Use this local utility tool to perform [^"]+ tasks in the browser without registration\.)"/g;

content = content.replace(regex, (match, id, space1, oldTitle, space2, oldDesc) => {
  if (rewrites[id]) {
    return `"utilityId": "${id}"${space1}"title": "${rewrites[id].title}"${space2}"description": "${rewrites[id].desc}"`;
  } else {
    // Generate a default pattern if not in rewrites
    const cleanId = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const newTitle = `${cleanId} Online – Free Browser-Based Tool`;
    const newDesc = `Use the free ${cleanId} tool to process your files securely in your web browser. No uploads, no registration, and zero privacy risk.`;
    return `"utilityId": "${id}"${space1}"title": "${newTitle}"${space2}"description": "${newDesc}"`;
  }
});

// Also fix some specific titles under 50 chars as requested
const shortTitleFixes = {
  "Add Text - Edit Image Online": "Add Text to Image Online – Free Browser-Based Editor",
  "Sign PDF - Manage PDF Pages": "Sign PDF Online Free – Add Signature to PDF in Browser",
  "Rotate PDF - Manage PDF Pages": "Rotate PDF Pages Online – Free Browser PDF Rotation Tool",
  "JS Minifier - Minify JS Code": "JS Minifier Online – Minify JavaScript Code Free"
};

for (const [oldTitle, newTitle] of Object.entries(shortTitleFixes)) {
  content = content.replace(new RegExp(`"title":\\s*"${oldTitle}"`, 'g'), `"title": "${newTitle}"`);
  content = content.replace(new RegExp(`"title":\\s*'${oldTitle}'`, 'g'), `"title": '${newTitle}'`);
}

// Ensure the other titles are updated in OpenGraph and Twitter
content = content.replace(/"openGraph":\s*{[\s\S]*?}/g, (match) => {
  let inner = match;
  for (const [oldTitle, newTitle] of Object.entries(shortTitleFixes)) {
    inner = inner.replace(new RegExp(`"title":\\s*"${oldTitle}"`, 'g'), `"title": "${newTitle}"`);
  }
  return inner;
});

content = content.replace(/"twitter":\s*{[\s\S]*?}/g, (match) => {
  let inner = match;
  for (const [oldTitle, newTitle] of Object.entries(shortTitleFixes)) {
    inner = inner.replace(new RegExp(`"title":\\s*"${oldTitle}"`, 'g'), `"title": "${newTitle}"`);
  }
  return inner;
});

// Now copy the updated titles to openGraph and twitter blocks for the tools we rewrote
Object.entries(rewrites).forEach(([id, rw]) => {
  // Regex to find the whole utility block
  const blockRegex = new RegExp(`"utilityId":\\s*"${id}"[\\s\\S]*?"schemaType"`, 'g');
  content = content.replace(blockRegex, (block) => {
    let newBlock = block;
    // Replace openGraph title and desc
    newBlock = newBlock.replace(/"openGraph":\s*{\s*"title":\s*"[^"]+",\s*"description":\s*"[^"]+"/, `"openGraph": {\n        "title": "${rw.title}",\n        "description": "${rw.desc}"`);
    // Replace twitter title and desc
    newBlock = newBlock.replace(/"twitter":\s*{\s*"card":\s*"[^"]+",\s*"title":\s*"[^"]+",\s*"description":\s*"[^"]+"/, `"twitter": {\n        "card": "summary_large_image",\n        "title": "${rw.title}",\n        "description": "${rw.desc}"`);
    return newBlock;
  });
});

fs.writeFileSync('src/lib/seo/utilityMetadata.ts', content);
console.log('Replaced boilerplate descriptions.');
