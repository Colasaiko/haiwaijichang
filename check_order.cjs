const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const brandsDir = 'src/content/brands';
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.md'));

let hasOrder = false;
for (const file of files) {
  const content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
  const parsed = matter(content);
  if (parsed.data.order !== undefined) {
    console.log(`${file}: order = ${parsed.data.order}`);
    hasOrder = true;
  }
}

if (!hasOrder) {
  console.log("No brands have an 'order' field.");
}
