const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

c = c.replace(/const origMatch = basePrice\.match/g, 'const origMatch = String(basePrice).match');
c = c.replace(/basePrice\.includes/g, 'String(basePrice).includes');

fs.writeFileSync('src/pages/brands/[slug].astro', c);
