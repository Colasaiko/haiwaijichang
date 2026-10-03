const fs = require('fs');

// 1. Fix checker
let checker = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');
checker = checker.replace("console.log('COUPON CONSISTENCY: PASS');\nconsole.log('CONTRADICTIONS: ' + errors);", "if (errors === 0) console.log('COUPON CONSISTENCY: PASS');\nconsole.log('CONTRADICTIONS: ' + errors);");
fs.writeFileSync('scripts/check-coupon-consistency.mjs', checker);

// 2. Fix yifan.md
let yifan = fs.readFileSync('src/content/brands/yifan.md', 'utf8');

// replace affiliateUrl
yifan = yifan.replace('affiliateUrl: "https://wzjc.1flyunaff.cc/#/?code=e61goYLt"', 'purchase:\n  label: "快速购买"\n  url: "https://wzjc.1flyunaff.cc/#/?code=e61goYLt"\n  cloaked: true');

// replace coupon props
yifan = yifan.replace('  label: "新用户专属 9折"\n  description', '  discount: "9折"\n  scope: "四个常规套餐全部周期 + 三个不限时包"\n  label: "新用户专属 9折"\n  description');

// replace visualData
const visualDataRegex = /visualData:[\s\S]*?(?=couponEligibility:)/;
const newVisualData = `visualData:
  traffic:
    - label: "轻享版"
      plan: "轻享版"
      value: 150
      display: "150GB"
    - label: "舒享版"
      plan: "舒享版"
      value: 350
      display: "350GB"
    - label: "尊享版"
      plan: "尊享版"
      value: 600
      display: "600GB"
    - label: "极致版"
      plan: "极致版"
      value: 1200
      display: "1.2TB"
  periodPrices:
    "轻享版":
      - period: 月付
        months: 1
        price: 20
      - period: 季付
        months: 3
        price: 55
      - period: 半年付
        months: 6
        price: 98
      - period: 年付
        months: 12
        price: 168
      - period: 两年付
        months: 24
        price: 298
      - period: 三年付
        months: 36
        price: 398
    "舒享版":
      - period: 月付
        months: 1
        price: 35
      - period: 季付
        months: 3
        price: 98
      - period: 半年付
        months: 6
        price: 178
      - period: 年付
        months: 12
        price: 298
      - period: 两年付
        months: 24
        price: 538
      - period: 三年付
        months: 36
        price: 698
    "尊享版":
      - period: 月付
        months: 1
        price: 55
      - period: 季付
        months: 3
        price: 155
      - period: 半年付
        months: 6
        price: 288
      - period: 年付
        months: 12
        price: 498
      - period: 两年付
        months: 24
        price: 888
      - period: 三年付
        months: 36
        price: 1188
    "极致版":
      - period: 月付
        months: 1
        price: 95
      - period: 季付
        months: 3
        price: 268
      - period: 半年付
        months: 6
        price: 498
      - period: 年付
        months: 12
        price: 888
      - period: 两年付
        months: 24
        price: 1588
      - period: 三年付
        months: 36
        price: 2188
  `;

yifan = yifan.replace(visualDataRegex, newVisualData);

fs.writeFileSync('src/content/brands/yifan.md', yifan);
