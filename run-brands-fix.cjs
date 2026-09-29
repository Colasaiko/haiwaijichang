const fs = require('fs');
let content = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

content = content.replace(/const title = brand\.seoTitle \|\| `([^`]+)`;/, 'const title = brand.seoTitle || brand.title || `$1`;');
content = content.replace(/const description = brand\.seoDescription \|\| `([^`]+)`;/, 'const description = brand.seoDescription || brand.description || `$1`;');

fs.writeFileSync('src/pages/brands/[slug].astro', content);
