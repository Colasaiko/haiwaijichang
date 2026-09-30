const fs = require('fs');
let c = fs.readFileSync('src/pages/guides.astro', 'utf8');

c = c.replace(/\/\/ Just map clash-what-is to clash for now if missing/, '');

fs.writeFileSync('src/pages/guides.astro', c);
