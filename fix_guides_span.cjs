const fs = require('fs');
let c = fs.readFileSync('src/pages/guides.astro', 'utf8');
c = c.replace(/<span(.*?)>\{hero\.allGuidesText\}<\/a>/g, '<span$1>{hero.allGuidesText}</span>');
fs.writeFileSync('src/pages/guides.astro', c);
console.log('fixed!');
