const fs = require('fs');
const path = require('path');

const dir = 'src/components/charts';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.astro')) {
    const p = path.join(dir, file);
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/\\`/g, '`').replace(/\\\$/g, '$');
    fs.writeFileSync(p, c);
  }
}

console.log('Fixed backslashes in charts');
