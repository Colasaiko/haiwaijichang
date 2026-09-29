const fs = require('fs');

let c = fs.readFileSync('src/pages/guides/[slug].astro', 'utf8');
c = c.replace(/params: \{ slug: entry\.slug \}/, "params: { slug: entry.slug || entry.id }");
fs.writeFileSync('src/pages/guides/[slug].astro', c);
console.log('Fixed guide slug.');
