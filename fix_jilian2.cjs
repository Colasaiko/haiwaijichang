const fs = require('fs');

let c = fs.readFileSync('src/content/brands/jilian.md', 'utf8');

c = c.replace(/code: "2happy80"\r?\n    discount: "8折"/, 'code: "2happy80"\n    discount: "8折"\n    discountPercent: "20%"');
c = c.replace(/code: "2happy85"\r?\n    discount: "85折"/, 'code: "2happy85"\n    discount: "85折"\n    discountPercent: "15%"');

fs.writeFileSync('src/content/brands/jilian.md', c);
