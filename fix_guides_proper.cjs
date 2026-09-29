const fs = require('fs');
let c = fs.readFileSync('src/pages/guides.astro', 'utf8');
c = c.replace(/<a href="javascript:void\(0\)" class="opacity-75 cursor-not-allowed" title="(.*?)" class="(.*?)">/g, '<div class="opacity-75 cursor-not-allowed $2" title="$1">');
c = c.replace(/<\/a>\s*\}\)\)/g, '</div>\n            }))');
fs.writeFileSync('src/pages/guides.astro', c);
