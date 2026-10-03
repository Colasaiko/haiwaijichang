const fs = require('fs');
let c = fs.readFileSync('src/content/brands/jilian.md', 'utf8');

const regex = /  resetPackages:\s*(?:    - plan: ".*"\s*      price: \d+\s*)+/;
c = c.replace(regex, '');

const resetText = `resetPackages:
  - plan: "限时年付套餐体验"
    price: 18
  - plan: "极连云 · 基础套餐"
    price: 18
  - plan: "极连云 · 进阶套餐"
    price: 32
  - plan: "极连云 · 旗舰套餐"
    price: 61
  - plan: "极连云 · 尊享套餐"
    price: 122
  - plan: "极连云 · 不限时套餐"
    price: 369
`;

c = c.replace('temporaryCoupons:', resetText + 'temporaryCoupons:');
fs.writeFileSync('src/content/brands/jilian.md', c);
