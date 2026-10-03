const fs = require('fs');

let c = fs.readFileSync('src/content/brands/edge.md', 'utf8');

const lines = c.split('\\n');
const newLines = lines.filter(l => !l.includes('overrideStandard'));

fs.writeFileSync('src/content/brands/edge.md', newLines.join('\\n'));
