const fs = require('fs');
let c = fs.readFileSync('src/pages/guides.astro', 'utf8');
c = c.replace(/<span(.*?)>\{allGuidesText\}<\/a>/g, '<span$1>{hero.allGuidesText}</span>');
c = c.replace(/<span(.*?)>\{hero.allGuidesText\}<\/a>/g, '<span$1>{hero.allGuidesText}</span>');
c = c.replace(/\{allGuidesText\}/g, '{hero.allGuidesText}');
fs.writeFileSync('src/pages/guides.astro', c);
