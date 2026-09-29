const fs = require('fs');

let c = fs.readFileSync('src/pages/brands/index.astro', 'utf8');
c = c.replace(/import fs from 'fs';\nimport path from 'path';\nconst brandsPath.*?;/, '');
c = c.replace(/const brands = JSON\.parse\(fs\.readFileSync\(brandsPath, "utf8"\)\);/, '');
fs.writeFileSync('src/pages/brands/index.astro', c);
