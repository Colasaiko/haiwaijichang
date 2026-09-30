const fs = require('fs');

const path = 'src/content/brands/feimao.md';
let content = fs.readFileSync(path, 'utf8');

// 1. coupon excludedPlans
content = content.replace(
  /excludedPlans:\s*- "飞猫·学生版"/,
  'excludedPlans:\n    - "飞猫·学生版"\n    - "飞猫·定制套餐"'
);

// 2. couponExample.note
content = content.replace(
  '飞猫·学生版不支持该优惠码。',
  '飞猫·学生版与飞猫·定制套餐不支持该优惠码。'
);

// 3. Warning section
content = content.replace(
  '### 学生版不支持优惠码\n飞猫·学生版不适用于任何优惠券。',
  '### 学生版与定制套餐不支持优惠码\n\n飞猫·学生版与飞猫·定制套餐当前均不适用于 flycat888。'
);

// 4. FAQ
content = content.replace(
  '### 飞猫学生版能用 flycat888 吗？\n不能。学生版不适用该优惠。',
  '### 飞猫定制套餐能用 flycat888 吗？\n\n不能。飞猫·定制套餐当前不适用 flycat888。\n\n### 飞猫学生版能用 flycat888 吗？\n\n不能。学生版不适用该优惠。'
);

fs.writeFileSync(path, content);
console.log('Cleaned up feimao.md');
