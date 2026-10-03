const fs = require('fs');
let em = fs.readFileSync('src/content/brands/ermao.md', 'utf8');

em = em.replace(/nodeCoverage:\n  total: "45"/, 'nodeCoverage:\n  total: "60+"');

fs.writeFileSync('src/content/brands/ermao.md', em);
