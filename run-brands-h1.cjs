const fs = require('fs');
let content = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

content = content.replace(/<h1>\{brand\.name\}<\/h1>/g, '<h1>{h1}</h1>');
content = content.replace(/<h1([^>]*)>\{brand\.name\}<\/h1>/g, '<h1$1>{h1}</h1>');

fs.writeFileSync('src/pages/brands/[slug].astro', content);
