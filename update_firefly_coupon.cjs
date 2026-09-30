const fs = require('fs');

const path = 'src/content/brands/firefly.md';
let content = fs.readFileSync(path, 'utf8');

// Replace excludedPlans with eligiblePeriods in temporaryCoupons
content = content.replace(/excludedPlans:\s*- "年付"\s*- "季付"\s*- "半年付"/, `eligiblePeriods:\n      - "月付"\n      - "一次性"`);

fs.writeFileSync(path, content);
console.log('Updated FireFly temporary coupon eligiblePeriods');
