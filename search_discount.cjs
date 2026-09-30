const fs = require('fs');
const path = require('path');

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      search(p);
    } else if (p.endsWith('.astro')) {
      const c = fs.readFileSync(p, 'utf8');
      if (c.includes('brand.discount') || c.includes('b.discount')) {
        console.log('Found in:', p);
      }
    }
  }
}
search('src');
