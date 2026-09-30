const fs = require('fs');

const path = 'src/content/brands/firefly.md';
let content = fs.readFileSync(path, 'utf8');

// 1. heroDescription
content = content.replace(
  '新用户可使用优惠码 firefly 享受 8 折优惠。',
  '符合条件的新用户套餐可使用优惠码 firefly 享受8折；Firefly年付版与不限时套餐不参与优惠。'
);

// 2. coupon excludedPlans
content = content.replace(
  '  sourceType: "official"',
  '  sourceType: "official"\n  excludedPlans:\n    - "Firefly年付版"\n    - "Firefly不限时"'
);

// 3. temporaryCoupons scope & eligiblePeriods
content = content.replace(
  'scope: "月付套餐 / 不限时"',
  'scope: "符合条件的月付套餐"'
);
content = content.replace(
  /eligiblePeriods:\s*- "月付"\s*- "一次性"/,
  'eligiblePeriods:\n      - "月付"'
);

// 4. annualPrice -> 年付版
content = content.replace(
  /label: "年付版"\s*plan: "Firefly年付版"\s*period: "年付"\s*original: 96\s*discounted: 76\.80/,
  'label: "年付版"\n      plan: "Firefly年付版"\n      period: "年付"\n      original: 96'
);

// 5. unlimitedTraffic -> Firefly不限时
content = content.replace(
  /label: "Firefly不限时"\s*plan: "Firefly不限时"\s*period: "一次性"\s*traffic: 100\s*original: 100\s*discounted: 80/,
  'label: "Firefly不限时"\n      plan: "Firefly不限时"\n      period: "一次性"\n      traffic: 100\n      original: 100'
);

// 6. line 277
content = content.replace(
  '新用户可使用优惠码 `firefly` 享受 **8 折** 优惠。',
  '优惠码 `firefly` 适用于符合条件的常规套餐；Firefly年付版与 Firefly不限时不参与优惠。'
);

// 7. Reference table
content = content.replace(
  '| 年付版 | ¥96 | ¥76.80 | ¥19.20 |',
  '| 年付版 | ¥96 | 不适用 | - |'
);

// 8. 年付版 text
content = content.replace(
  '使用优惠码 `firefly` 后，年付版变为 **¥76.80/年**，折合约 **¥6.40/月**（同样为年付折算，不是月付）。',
  '该套餐不适用优惠码，必须以 ¥96 原价支付。'
);

// 9. 不限时 text
content = content.replace(
  '使用优惠码 `firefly` 后，不限时包变为 **¥80**。',
  '该不限时包不适用优惠码，必须以 ¥100 原价支付。'
);

// 10. scope text
content = content.replace(
  '官方资料显示该优惠码适用对象为**新用户**。所有套餐（包括年付版、Lite、Plus、Blaze、Nova 以及不限时包）均支持使用。',
  '官方资料显示该优惠码适用对象为**新用户**。优惠码适用于符合条件的常规套餐（Lite、Plus、Blaze、Nova）；Firefly年付版与 Firefly不限时不参与优惠。'
);

// 11. Pros text
content = content.replace(
  '**新用户 8 折** — 优惠码 firefly',
  '**新用户 8 折** — 优惠码 firefly（部分特价及不限时套餐除外）'
);

fs.writeFileSync(path, content);
console.log('Cleaned up firefly.md');
