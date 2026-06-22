const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Extract arguments: --src <source> --dest <destination>
const args = process.argv.slice(2);
let src = '';
let dest = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--src' && args[i + 1]) {
    src = args[i + 1];
  }
  if (args[i] === '--dest' && args[i + 1]) {
    dest = args[i + 1];
  }
}

if (!src || !dest) {
  console.error('Usage: node convert.js --src <source_path> --dest <dest_path>');
  process.exit(1);
}

const absoluteSrc = path.resolve(src);
const absoluteDest = path.resolve(dest);

// Ensure destination directory exists
const destDir = path.dirname(absoluteDest);
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

sharp(absoluteSrc)
  .webp({ quality: 90 })
  .toFile(absoluteDest)
  .then(info => {
    console.log(`Successfully converted ${absoluteSrc} to ${absoluteDest}`, info);
    process.exit(0);
  })
  .catch(err => {
    console.error(`Error converting ${absoluteSrc} to ${absoluteDest}:`, err);
    process.exit(1);
  });
