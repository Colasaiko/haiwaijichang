const fs = require('fs');

let em = fs.readFileSync('src/content/brands/ermao.md', 'utf8');

// 1. purchase block
em = em.replace(/affiliateUrl: "https:\/\/waaa\.2maoyunaff\.cc\/\#\/\?code=c842udvC"/, `purchase:
  label: "快速购买"
  url: "https://waaa.2maoyunaff.cc/#/?code=c842udvC"
  cloaked: true`);

// 2. coupon scope
em = em.replace(/  discountPercent: "15%"\n  label: "全场 85折"/, `  discountPercent: "15%"\n  discount: "85折"\n  scope: "年付小包 + 白猫/橘猫/牛奶猫/黑猫全部周期"\n  label: "全场 85折"`);
em = em.replace(/  - code: "zqj80"\n    discountPercent: "20%"\n    label: "双节长周期 8折"/, `  - code: "zqj80"\n    discountPercent: "20%"\n    discount: "8折"\n    scope: "白猫/橘猫/牛奶猫/黑猫年付、两年付、三年付"\n    label: "双节长周期 8折"`);

// 3. Traffic for 年付小包
em = em.replace(/- name: "二猫年付小包"\n    traffic: "按说明"/g, `- name: "二猫年付小包"\n    traffic: "60GB/月"`);

// 4 & 5. visualData replacement
const oldVisRegex = /visualData:[\s\S]*?(?=couponEligibility:)/;
const newVis = `visualData:
  traffic:
    - label: "白猫"
      plan: "白猫"
      value: 130
      display: "130GB"
    - label: "橘猫"
      plan: "橘猫"
      value: 230
      display: "230GB"
    - label: "牛奶猫"
      plan: "牛奶猫"
      value: 430
      display: "430GB"
    - label: "黑猫"
      plan: "黑猫"
      value: 850
      display: "850GB"
  periodPrices:
    "二猫年付小包":
      - period: 年付
        months: 12
        price: 96
      - period: 两年付
        months: 24
        price: 175
      - period: 三年付
        months: 36
        price: 265
    "白猫":
      - period: 月付
        months: 1
        price: 20
      - period: 季付
        months: 3
        price: 57
      - period: 半年付
        months: 6
        price: 108
      - period: 年付
        months: 12
        price: 204
      - period: 两年付
        months: 24
        price: 384
      - period: 三年付
        months: 36
        price: 504
    "橘猫":
      - period: 月付
        months: 1
        price: 40
      - period: 季付
        months: 3
        price: 114
      - period: 半年付
        months: 6
        price: 216
      - period: 年付
        months: 12
        price: 408
      - period: 两年付
        months: 24
        price: 768
      - period: 三年付
        months: 36
        price: 1008
    "牛奶猫":
      - period: 月付
        months: 1
        price: 80
      - period: 季付
        months: 3
        price: 228
      - period: 半年付
        months: 6
        price: 432
      - period: 年付
        months: 12
        price: 816
      - period: 两年付
        months: 24
        price: 1536
      - period: 三年付
        months: 36
        price: 2016
    "黑猫":
      - period: 月付
        months: 1
        price: 160
      - period: 季付
        months: 3
        price: 456
      - period: 半年付
        months: 6
        price: 864
      - period: 年付
        months: 12
        price: 1632
      - period: 两年付
        months: 24
        price: 3072
      - period: 三年付
        months: 36
        price: 4032
  `;

em = em.replace(oldVisRegex, newVis);

fs.writeFileSync('src/content/brands/ermao.md', em);
