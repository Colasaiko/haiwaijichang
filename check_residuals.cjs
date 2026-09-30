const fs = require('fs');

const fireflyPath = 'src/content/brands/firefly.md';
let fireflyContent = fs.readFileSync(fireflyPath, 'utf8');

const feimaoPath = 'src/content/brands/feimao.md';
let feimaoContent = fs.readFileSync(feimaoPath, 'utf8');

console.log("=== FIREFLY SUMMARY ===");
console.log("Has 76.80?", fireflyContent.includes('76.80'));
console.log("Has ¥80?", fireflyContent.includes('¥80'));
console.log("Has 所有套餐均可用?", fireflyContent.includes('所有套餐') && fireflyContent.includes('均可'));
console.log("flymoon80 periods?", fireflyContent.match(/eligiblePeriods:[\s\S]*?- "月付"/)[0]);
console.log("Firefly excludedPlans?", fireflyContent.match(/excludedPlans:[\s\S]*?"Firefly不限时"/)[0]);

console.log("\n=== FEIMAO SUMMARY ===");
console.log("Feimao excludedPlans?", feimaoContent.match(/excludedPlans:[\s\S]*?"飞猫·定制套餐"/)[0]);
console.log("Feimao text?", feimaoContent.includes('飞猫·学生版与飞猫·定制套餐当前均不适用于 flycat888'));
console.log("Feimao FAQ?", feimaoContent.includes('不能。飞猫·定制套餐当前不适用 flycat888'));

