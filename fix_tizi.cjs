const fs = require('fs');
let s = fs.readFileSync('update_tizi.cjs', 'utf8');
s = s.replace(/\\`/g, '`');
fs.writeFileSync('update_tizi.cjs', s);
console.log('Fixed');
