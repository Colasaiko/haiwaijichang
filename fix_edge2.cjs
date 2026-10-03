const fs = require('fs');
let c = fs.readFileSync('src/content/brands/edge.md', 'utf8');

c = c.replace(/overrideStandard:\s*true\n/g, '');

fs.writeFileSync('src/content/brands/edge.md', c);
