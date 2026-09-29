const fs = require('fs');
let c = fs.readFileSync('src/pages/guides.astro', 'utf8');
c = c.replace(/<\/a>([\s\S]{1,20}\}\)\))/g, '</div>$1');
c = c.replace(/<a href="javascript:void\(0\)"/g, '<div');
fs.writeFileSync('src/pages/guides.astro', c);
