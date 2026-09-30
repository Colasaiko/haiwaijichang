const fs = require('fs');

const path = 'src/content/brands/firefly.md';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/label: "年付版"\s*original: 96/, 'label: "年付版"\n      plan: "Firefly年付版"\n      period: "年付"\n      original: 96');
content = content.replace(/label: "Lite"\s*original: 240/, 'label: "Lite"\n      plan: "Firefly Lite"\n      period: "年付"\n      original: 240');
content = content.replace(/label: "Plus"\s*original: 432/, 'label: "Plus"\n      plan: "Firefly Plus"\n      period: "年付"\n      original: 432');
content = content.replace(/label: "Blaze"\s*original: 816/, 'label: "Blaze"\n      plan: "Firefly Blaze"\n      period: "年付"\n      original: 816');
content = content.replace(/label: "Nova"\s*original: 1360/, 'label: "Nova"\n      plan: "Firefly Nova"\n      period: "年付"\n      original: 1360');
content = content.replace(/label: "Firefly不限时"\s*traffic: 100\s*original: 100/, 'label: "Firefly不限时"\n      plan: "Firefly不限时"\n      period: "一次性"\n      traffic: 100\n      original: 100');

fs.writeFileSync(path, content);
console.log('Updated FireFly visualData with plan/period mapping');
