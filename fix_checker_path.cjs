const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');
c = c.replace(/fs\.readFileSync\(kuailiFile, 'utf8'\)/g, "fs.readFileSync(path.join(brandsDir, kuailiFile), 'utf8')");
c = c.replace(/fs\.readFileSync\(feivFile, 'utf8'\)/g, "fs.readFileSync(path.join(brandsDir, feivFile), 'utf8')");
fs.writeFileSync('scripts/check-coupon-consistency.mjs', c, 'utf8');

console.log('Fixed path.');
