const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const checkScript = 'scripts/check-coupon-consistency.mjs';
let content = fs.readFileSync(checkScript, 'utf8');

const invisibleTests = `
// --- INVISIBLE Consistency Test ---
const invFile = files.find(f => f.endsWith('invisible.md'));
if (invFile) {
  let invErrors = 0;
  const invRaw = fs.readFileSync(path.join(brandsDir, invFile), 'utf8');
  const invBrand = matter(invRaw).data;
  
  if (invBrand.pricing.length !== 29) {
    console.error('ERROR: INVISIBLE pricing length expected 29, got ' + invBrand.pricing.length);
    invErrors++; errors++;
  }
  
  const testInvCalc = (name, period, original, expected, expectedCode = null, testDate = '2026-10-01T00:00:00Z') => {
    const plan = invBrand.pricing.find(p => p.name === name && p.period === period);
    if (!plan) return false;
    const cp = getBestCouponForPricing(invBrand, plan, new Date(testDate));
    if (expected === null) {
      if (cp !== null) {
        console.error(\`ERROR: INVISIBLE \${name} \${period} expected null coupon, got \${cp.code}\`);
        return false;
      }
    } else {
      if (!cp) {
        console.error(\`ERROR: INVISIBLE \${name} \${period} expected coupon \${expectedCode}, got null\`);
        return false;
      }
      if (expectedCode && cp.code !== expectedCode) {
        console.error(\`ERROR: INVISIBLE \${name} \${period} expected code \${expectedCode}, got \${cp.code}\`);
        return false;
      }
      const mult = getDiscountMultiplier(cp);
      const finalPrice = original * mult;
      if (Math.abs(finalPrice - expected) > 0.01) {
        console.error(\`ERROR: INVISIBLE \${name} \${period} expected \${expected}, got \${finalPrice} (coupon: \${cp.code})\`);
        return false;
      }
    }
    return true;
  };
  
  let invPricePass = true;
  
  // yxr888 logic
  if (!testInvCalc('隐形人 白银纪元', '月付', 24, 19.2, 'yxr888')) invPricePass = false;
  if (!testInvCalc('隐形人 黄金序列', '月付', 48, 38.4, 'yxr888')) invPricePass = false;
  if (!testInvCalc('隐形人 铂金至臻', '月付', 105, 84, 'yxr888')) invPricePass = false;
  if (!testInvCalc('隐形人 钻石穹顶', '月付', 185, 148, 'yxr888')) invPricePass = false;
  
  // moon80 logic
  if (!testInvCalc('隐形人 白银纪元', '年付', 244.8, 195.84, 'moon80')) invPricePass = false;
  if (!testInvCalc('隐形人 星耀风暴', '年付', 109, 87.2, 'moon80')) invPricePass = false;
  
  // moon85 logic
  if (!testInvCalc('隐形人 王者定制版', '月付', 680, 578, 'moon85')) invPricePass = false;
  
  // nulls
  if (!testInvCalc('隐形人 一次性小流量包', '一次性', 229, null)) invPricePass = false;
  if (!testInvCalc('隐形人 一次性标准包', '一次性', 549, null)) invPricePass = false;
  if (!testInvCalc('隐形人 一次性精英包', '一次性', 1199, null)) invPricePass = false;

  if (!invPricePass) {
    invErrors++; errors++;
  } else {
    console.log('INVISIBLE COUPON CONSISTENCY: PASS');
  }
}
`;

content = content.replace(/if \(errors === 0\) console\.log\('COUPON CONSISTENCY: PASS'\);[\s\S]*$/, invisibleTests + '\nif (errors === 0) console.log(\'COUPON CONSISTENCY: PASS\');\nconsole.log(\'CONTRADICTIONS: \' + errors);\nif (errors > 0) process.exit(1);\n');
fs.writeFileSync(checkScript, content, 'utf8');
console.log('Appended INVISIBLE tests');
