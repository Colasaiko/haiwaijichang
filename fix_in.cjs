const fs = require('fs');
let c = fs.readFileSync('update_invisible.cjs', 'utf8');
c = c.replace(/\\`/g, '`');
fs.writeFileSync('update_invisible.cjs', c);
