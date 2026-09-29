const fs = require('fs');
let content = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

content = content.replace(/const title = `([^`]+)`;/, 'const title = brand.seoTitle || brand.title || `$1`;');
content = content.replace(/const description = `([^`]+)`;/, 'const description = brand.seoDescription || brand.description || `$1`;');
content = content.replace(/const currentUrl/, 'const h1 = brand.h1 || brand.name;\nconst currentUrl');
content = content.replace(/<h1>\{brand.name\}<\/h1>/g, '<h1>{h1}</h1>');
content = content.replace(/<h1([^>]*)>\{brand.name\}<\/h1>/g, '<h1$1>{h1}</h1>'); // in case it has classes

fs.writeFileSync('src/pages/brands/[slug].astro', content);
