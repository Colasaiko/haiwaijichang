const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/index.astro', 'utf8');

c = c.replace('// Read brands data', '');
c = c.replace("const brandsPath = path.resolve(process.cwd(), 'src/data/brands.json');", '');
c = c.replace("const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));", '');
c = c.replace('import fs from \'node:fs\';', '');
c = c.replace('import path from \'node:path\';', '');

fs.writeFileSync('src/pages/brands/index.astro', c);
