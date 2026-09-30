const fs = require('fs');

const path = 'src/content/brands/firefly.md';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('flymoon80')) {
  const insertText = `
temporaryCoupons:
  - id: "firefly-flymoon80-2026"
    name: "限时 8 折优惠"
    code: "flymoon80"
    discount: "8折"
    discountPercent: "20%"
    scope: "月付套餐 / 不限时"
    startsAt: "2026-09-01T00:00:00+08:00"
    expiresAt: "2026-10-15T23:59:59+08:00"
    verified: true
    priority: 100
    excludedPlans:
      - "年付"
      - "季付"
      - "半年付"
`;

  content = content.replace(/sourceType: "official"\n/, `sourceType: "official"\n${insertText}`);
  fs.writeFileSync(path, content);
  console.log('Added temporary coupon to firefly');
}
