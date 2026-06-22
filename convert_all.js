const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\RISHI\\.gemini\\antigravity\\brain\\b9edfce9-4efd-4af3-843a-82c840d085d2';
const destDir = 'c:/Users/RISHI/Desktop/hello/assets/products';

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Find files in brain directory
const files = fs.readdirSync(brainDir);

function findFile(prefix) {
  const found = files.find(f => f.startsWith(prefix) && f.endsWith('.png'));
  return found ? path.join(brainDir, found) : null;
}

const mop1 = findFile('cleaning_mop_1');
const mop2 = findFile('cleaning_mop_2');
const mop3 = findFile('cleaning_mop_3');
const broom1 = findFile('broom_1');
const broom2 = findFile('broom_2');
const broom3 = findFile('broom_3');
const brush1 = findFile('cleaning_brush_1');

const mapping = [
  { src: mop1, dest: 'cleaning-mop-1.webp' },
  { src: mop2, dest: 'cleaning-mop-2.webp' },
  { src: mop3, dest: 'cleaning-mop-3.webp' },
  { src: broom1, dest: 'broom-1.webp' },
  { src: broom2, dest: 'broom-2.webp' },
  { src: broom3, dest: 'broom-3.webp' },
  { src: brush1, dest: 'cleaning-brush-1.webp' },
  { src: brush1, dest: 'cleaning-brush-2.webp' },
  { src: brush1, dest: 'cleaning-brush-3.webp' },
  { src: brush1, dest: 'washroom-brush-1.webp' },
  { src: brush1, dest: 'washroom-brush-2.webp' },
  { src: brush1, dest: 'washroom-brush-3.webp' },
];

async function convert(srcPath, destName) {
  const destPath = path.join(destDir, destName);
  if (!srcPath) {
    console.error(`Source file not found for ${destName}`);
    return;
  }
  try {
    await sharp(srcPath)
      .webp({ quality: 90 })
      .toFile(destPath);
    console.log(`Converted ${srcPath} to ${destPath}`);
  } catch (err) {
    console.error(`Error converting ${srcPath} to ${destPath}:`, err);
  }
}

async function run() {
  for (const item of mapping) {
    await convert(item.src, item.dest);
  }

  // Handle dustbins by copying bucket-tub-1.webp
  const bucketTubPath = path.join(destDir, 'bucket-tub-1.webp');
  if (fs.existsSync(bucketTubPath)) {
    try {
      fs.copyFileSync(bucketTubPath, path.join(destDir, 'dustbin-1.webp'));
      fs.copyFileSync(bucketTubPath, path.join(destDir, 'dustbin-2.webp'));
      fs.copyFileSync(bucketTubPath, path.join(destDir, 'dustbin-3.webp'));
      console.log('Successfully copied bucket-tub-1.webp to dustbin webp files.');
    } catch (err) {
      console.error('Error copying dustbin files:', err);
    }
  } else {
    console.error('bucket-tub-1.webp not found, copying mop images as fallback for dustbins');
    await convert(mop1, 'dustbin-1.webp');
    await convert(mop2, 'dustbin-2.webp');
    await convert(mop3, 'dustbin-3.webp');
  }
  
  console.log('All done!');
}

run();
