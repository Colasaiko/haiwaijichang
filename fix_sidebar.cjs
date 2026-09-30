const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

c = c.replace(/<!-- Sidebar -->\s*<div class="space-y-8 sticky top-24">/, 
`<!-- Sidebar -->\n      <div class="space-y-8 sticky top-24 self-start h-max max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pt-4 pb-8">`);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Fixed sticky sidebar');
