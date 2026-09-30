const fs = require('fs');

// Update FireFly
const fireflyPath = 'src/content/brands/firefly.md';
let fireflyContent = fs.readFileSync(fireflyPath, 'utf8');

// The first replacement is for Firefly年付版
fireflyContent = fireflyContent.replace(
  /name: "Firefly年付版"\s*traffic: "60GB\/月"\s*period: "年付"\s*originalPrice: "¥96"\s*couponEligible: true/,
  'name: "Firefly年付版"\n    traffic: "60GB/月"\n    period: "年付"\n    originalPrice: "¥96"\n    couponEligible: false'
);

// The second replacement is for Firefly不限时
fireflyContent = fireflyContent.replace(
  /name: "Firefly不限时"\s*traffic: "100GB总量"\s*period: "一次性"\s*originalPrice: "¥100"\s*couponEligible: true/,
  'name: "Firefly不限时"\n    traffic: "100GB总量"\n    period: "一次性"\n    originalPrice: "¥100"\n    couponEligible: false'
);

fs.writeFileSync(fireflyPath, fireflyContent);
console.log('Updated firefly.md');

// Update Feimao
const feimaoPath = 'src/content/brands/feimao.md';
let feimaoContent = fs.readFileSync(feimaoPath, 'utf8');

feimaoContent = feimaoContent.replace(
  /name: "飞猫·定制套餐"\s*traffic: "500GB"\s*period: "月付"\s*originalPrice: "¥550"\s*couponEligible: true/,
  'name: "飞猫·定制套餐"\n    traffic: "500GB"\n    period: "月付"\n    originalPrice: "¥550"\n    couponEligible: false'
);

fs.writeFileSync(feimaoPath, feimaoContent);
console.log('Updated feimao.md');
