const fs = require('fs');
let c = fs.readFileSync('src/content/brands/yifan.md', 'utf8');

const regex1 = /  periodPrices:\n    "轻享版":\n      "月付": "¥20"\n      "年付": "¥168"\n    "舒享版":\n      "月付": "¥35"\n      "年付": "¥298"\n    "尊享版":\n      "月付": "¥55"\n      "年付": "¥498"\n    "极致版":\n      "月付": "¥95"\n      "年付": "¥888"/g;

const goodYaml = `  periodPrices:
    "轻享版":
      - period: 月付
        months: 1
        price: 20
      - period: 年付
        months: 12
        price: 168
    "舒享版":
      - period: 月付
        months: 1
        price: 35
      - period: 年付
        months: 12
        price: 298
    "尊享版":
      - period: 月付
        months: 1
        price: 55
      - period: 年付
        months: 12
        price: 498
    "极致版":
      - period: 月付
        months: 1
        price: 95
      - period: 年付
        months: 12
        price: 888`;

c = c.replace(regex1, goodYaml);
fs.writeFileSync('src/content/brands/yifan.md', c);
