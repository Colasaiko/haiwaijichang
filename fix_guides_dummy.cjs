const fs = require('fs');
let c = fs.readFileSync('src/pages/guides.astro', 'utf8');
c = c.replace(/<a href="javascript:void\(0\)"/g, '<div');
c = c.replace(/<\/a>\s*\}\)\)/g, '</div>\n            }))');
fs.writeFileSync('src/pages/guides.astro', c);
