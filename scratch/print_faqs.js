const { getPostBySlug } = require('../src/lib/blog');

const postA = getPostBySlug('heic-to-jpg-guide');
const postB = getPostBySlug('png-to-jpg-guide');

console.log('HEIC to JPG FAQs:', JSON.stringify(postA.faqs, null, 2));
console.log('PNG to JPG FAQs:', JSON.stringify(postB.faqs, null, 2));
