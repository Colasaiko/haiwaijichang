const fs = require('fs');

const file = 'src/components/charts/CouponComparison.astro';
let content = fs.readFileSync(file, 'utf8');

const regex = /function checkPlanEligibility[\s\S]*?return true;\n\}\n/m;
content = content.replace(regex, '');
content = content.replace(/const activeCoupon = getActiveCoupon\(brand\);\n/, '');

fs.writeFileSync(file, content);
console.log('Cleaned up CouponComparison.astro');
