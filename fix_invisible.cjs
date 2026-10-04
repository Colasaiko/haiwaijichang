const fs = require('fs');
const matter = require('gray-matter');

// 1. Fix invisible.md literal "\n"s
const mdFile = 'src/content/brands/invisible.md';
let raw = fs.readFileSync(mdFile, 'utf8');
let parsed = matter(raw);

// Replace literal "\n" strings with actual newlines
parsed.content = parsed.content.replace(/\\n/g, '\n');

// Ensure spacing is normal
const output = matter.stringify(parsed.content, parsed.data);
fs.writeFileSync(mdFile, output, 'utf8');
console.log('Fixed invisible.md literal \\n issues.');

// 2. Patch check-coupon-consistency.mjs
const checkScript = 'scripts/check-coupon-consistency.mjs';
let scriptContent = fs.readFileSync(checkScript, 'utf8');

const countLogic = `
  let yxr888Count = 0;
  for (const plan of invBrand.pricing) {
    const cp = getStandardCouponForPricing(invBrand, plan);
    if (cp && cp.code === 'yxr888') {
      yxr888Count++;
    }
  }
  if (yxr888Count !== 24) {
    console.error('ERROR: INVISIBLE yxr888 expected exactly 24 eligible plans, got ' + yxr888Count);
    invErrors++; errors++;
  }
  
  let invPricePass = true;`;

scriptContent = scriptContent.replace(/let invPricePass = true;/, countLogic);

fs.writeFileSync(checkScript, scriptContent, 'utf8');
console.log('Patched check-coupon-consistency.mjs with yxr888 count assertion.');
