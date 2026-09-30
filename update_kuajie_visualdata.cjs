const fs = require('fs');

const path = 'src/content/brands/kuajie.md';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/label: "Lite"\s*original: 20/, 'label: "Lite"\n      plan: "轻云 Lite"\n      period: "月付"\n      original: 20');
content = content.replace(/label: "Leap"\s*original: 40/, 'label: "Leap"\n      plan: "跃云 Leap"\n      period: "月付"\n      original: 40');
content = content.replace(/label: "Soar"\s*original: 90/, 'label: "Soar"\n      plan: "凌云 Soar"\n      period: "月付"\n      original: 90');
content = content.replace(/label: "Infinity"\s*original: 130/, 'label: "Infinity"\n      plan: "无界 Infinity"\n      period: "月付"\n      original: 130');
content = content.replace(/label: "跨界·不限时包"\s*traffic: 300/, 'label: "跨界·不限时包"\n      plan: "跨界·不限时包"\n      period: "一次性"\n      traffic: 300');

fs.writeFileSync(path, content);
console.log('Updated Kuajie visualData mapping');
