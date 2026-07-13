const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '..', 'products-data.js');
let content = fs.readFileSync(filepath, 'utf8');

// Parse out the array block
const arrayStartIndex = content.indexOf('[');
const arrayEndIndex = content.lastIndexOf(']') + 1;
const arrayCode = content.substring(arrayStartIndex, arrayEndIndex);

// Safely evaluate the array literal to load it as a JS object
const products = eval(arrayCode);

const categorySpecs = {
  'Storage & Utility': { 'Material': 'Premium Virgin Polymer', 'Usage': 'Home Storage', 'Installation': 'Freestanding' },
  'Kitchen & Dining': { 'Material': 'Food-Grade BPA-Free Acrylic', 'Usage': 'Dining & Kitchen', 'Installation': 'Freestanding' },
  'Cleaning Essentials': { 'Material': 'Heavy-duty Polyurethane & Steel', 'Usage': 'Household Cleaning', 'Installation': 'Manual' },
  'Bathroom Accessories': { 'Material': 'Curated Virgin Plastic', 'Usage': 'Bathroom Organizer', 'Installation': 'Adhesive Wall Mount / Freestanding' },
  'Home & Garden': { 'Material': 'Weather-resistant Virgin Polymer', 'Usage': 'Garden & Outdoor', 'Installation': 'Freestanding' }
};

const categoryColors = {
  'Storage & Utility': ['#F5F5DC', '#D2B48C', '#2F4F4F', '#8FBC8F'], // Cream, Sand, Dark Charcoal, Muted Sage
  'Kitchen & Dining': ['#FFFFFF', '#F0E68C', '#E6E6FA', '#BC8F8F'], // White, Soft Gold, Lavender, Terracotta
  'Cleaning Essentials': ['#2E8B57', '#4682B4', '#708090', '#F7F3EC'], // Forest Green, Steel Blue, Slate, Warm Ivory
  'Bathroom Accessories': ['#FFFFFF', '#FAF0E6', '#B0C4DE', '#5F9EA0'], // White, Linen, Powder Blue, Cadis Blue
  'Home & Garden': ['#556B2F', '#8B4513', '#A0522D', '#D8BFD8'] // Olive, Bronze, Terracotta, Clay
};

const enriched = products.map(p => {
  const slug = p.name.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const specs = {
    'Brand': 'Kalavathi Plastics',
    'Origin': 'Made in India',
    ...categorySpecs[p.category] || { 'Material': 'Premium Virgin Polymer', 'Usage': 'Multi-purpose' }
  };

  const colors = categoryColors[p.category] || ['#FFFFFF', '#D2B48C'];
  const sizes = p.variants || ['Standard'];

  // Ensure we have at least 5 images for the Amazon-style thumbnail gallery
  let galleryImages = p.images && Array.isArray(p.images) ? [...p.images] : [];
  if (galleryImages.length === 0) {
    galleryImages.push('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="%23777">No Image</text></svg>');
  }
  const baseImg = galleryImages[0];
  while (galleryImages.length < 5) {
    galleryImages.push(baseImg); // Repeat the main image to pad gallery thumbnails
  }

  return {
    id: p.id,
    slug: slug,
    name: p.name,
    category: p.category,
    badge: p.badge || null,
    shortDescription: p.description,
    fullDescription: `${p.description} Crafted with premium attention to detail, this product coordinates effortlessly with our editorial, warm boutique aesthetic to elevate your everyday routines.`,
    features: p.features || [],
    specifications: specs,
    colors: colors,
    sizes: sizes,
    images: galleryImages,
    thumbnail: baseImg,
    whatsappMessage: `Hello, I'm interested in your wholesale product: ${p.name}. Please provide pricing and minimum order quantity (MOQ) details.`
  };
});

const output = `// --- SHARED PRODUCT DIRECTORY DEFAULT DATA ---\nconst DEFAULT_PRODUCTS = ${JSON.stringify(enriched, null, 2)};\n`;
fs.writeFileSync(filepath, output, 'utf8');
console.log('Successfully enriched products-data.js with new details schema!');
