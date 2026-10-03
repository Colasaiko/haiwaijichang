const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const checkScript = 'scripts/check-coupon-consistency.mjs';
let content = fs.readFileSync(checkScript, 'utf8');

const wavenetTests = `
// --- WAVENET Consistency Test ---
const wnFile = files.find(f => f.endsWith('wavenet.md'));
if (wnFile) {
  let wnErrors = 0;
  const wnRaw = fs.readFileSync(path.join(brandsDir, wnFile), 'utf8');
  const wnBrand = matter(wnRaw).data;
  
  if (wnBrand.pricing.length !== 29) {
    console.error('ERROR: WAVENET pricing length expected 29, got ' + wnBrand.pricing.length);
    wnErrors++; errors++;
  }
  
  let validWnCoupons = 0;
  for (const plan of wnBrand.pricing) {
    const cp = getStandardCouponForPricing(wnBrand, plan);
    if (cp && cp.code === 'lw888') {
      validWnCoupons++;
    }
  }
  if (validWnCoupons !== 24) {
    console.error('ERROR: WAVENET expected 24 eligible plans for lw888, got ' + validWnCoupons);
    wnErrors++; errors++;
  }
  
  const testWnCalc = (name, period, original, expected) => {
    const plan = wnBrand.pricing.find(p => p.name === name && p.period === period);
    if (!plan) return false;
    const cp = getBestCouponForPricing(wnBrand, plan, new Date('2026-10-01T00:00:00Z'));
    if (expected === null) {
      if (cp !== null) {
        console.error(\`ERROR: WAVENET \${name} \${period} expected null coupon, got \${cp.code}\`);
        return false;
      }
    } else {
      const mult = getDiscountMultiplier(cp);
      const finalPrice = original * mult;
      if (Math.abs(finalPrice - expected) > 0.01) {
        console.error(\`ERROR: WAVENET \${name} \${period} expected \${expected}, got \${finalPrice}\`);
        return false;
      }
    }
    return true;
  };
  
  let wnPricePass = true;
  if (!testWnCalc('浪网 入门', '月付', 30, 24)) wnPricePass = false;
  if (!testWnCalc('浪网 进阶', '月付', 70, 56)) wnPricePass = false;
  if (!testWnCalc('浪网 高端', '月付', 120, 96)) wnPricePass = false;
  if (!testWnCalc('浪网 商业', '月付', 200, 160)) wnPricePass = false;
  
  if (!testWnCalc('浪网 年付标准', '年付', 119, null)) wnPricePass = false;
  if (!testWnCalc('浪网 小流量包', '一次性', 239, null)) wnPricePass = false;
  if (!testWnCalc('浪网 标准流量包', '一次性', 569, null)) wnPricePass = false;
  if (!testWnCalc('浪网 精英流量包', '一次性', 1099, null)) wnPricePass = false;
  if (!testWnCalc('浪网 定制线路', '月付', 680, null)) wnPricePass = false;

  if (!wnPricePass) {
    wnErrors++; errors++;
  } else {
    console.log('WAVENET COUPON CONSISTENCY: PASS');
  }
}

if (errors === 0) console.log('COUPON CONSISTENCY: PASS');
console.log('CONTRADICTIONS: ' + errors);
if (errors > 0) process.exit(1);
`;

content = content.replace(/if \(errors === 0\) console\.log\('COUPON CONSISTENCY: PASS'\);[\s\S]*$/, wavenetTests);
fs.writeFileSync(checkScript, content, 'utf8');
console.log('Appended WAVENET tests');
