const fs = require('fs');
const path = require('path');

const brandsDir = 'src/content/brands';
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.md'));

// Read all frontmatters
const brands = files.map(file => {
  const content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
  const match = content.match(/^order:\s*(\d+)/m);
  let order = match ? parseInt(match[1]) : 999;
  return { file, content, order };
});

// Sort by current order, then alphabetically by filename
brands.sort((a, b) => {
  if (a.order !== b.order) {
    return a.order - b.order;
  }
  return a.file.localeCompare(b.file);
});

// Re-assign order starting from 1
brands.forEach((brand, index) => {
  const newOrder = index + 1;
  if (brand.order !== newOrder || !brand.content.match(/^order:\s*\d+/m)) {
    let newContent = brand.content;
    if (newContent.match(/^order:\s*\d+/m)) {
      newContent = newContent.replace(/^order:\s*\d+/m, `order: ${newOrder}`);
    } else {
      // insert after name:
      newContent = newContent.replace(/name:\s*".*?"\n/, `$&order: ${newOrder}\n`);
    }
    fs.writeFileSync(path.join(brandsDir, brand.file), newContent);
    console.log(`Updated ${brand.file} to order: ${newOrder} (was ${brand.order})`);
  }
});
