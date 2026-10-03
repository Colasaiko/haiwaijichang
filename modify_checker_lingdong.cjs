const fs = require('fs');
let checkScript = 'scripts/check-coupon-consistency.mjs';
let content = fs.readFileSync(checkScript, 'utf8');

const oldLingdongTestRegex = /\/\/ --- LINGDONG Consistency Test ---[\s\S]+?LINGDONG COUPON CONSISTENCY: PASS'\);\s*\n\s*\}/;

const newLingdongTests = `// --- LINGDONG Consistency Test ---
const ldFile = files.find(f => f.endsWith('lingdong.md'));
if (ldFile) {
  let ldErrors = 0;
  const ldRaw = fs.readFileSync(path.join(brandsDir, ldFile), 'utf8');
  const ldBrand = matter(ldRaw).data;
  
  if (ldBrand.pricing.length !== 29) {
    console.error('ERROR: LINGDONG pricing length expected 29, got ' + ldBrand.pricing.length);
    ldErrors++; errors++;
  }
  
  if (ldBrand.coupon) {
    console.error('ERROR: LINGDONG must not have any standard coupon (found: ' + ldBrand.coupon.code + ')');
    ldErrors++; errors++;
  }
  
  const testLdCalc = (name, period, original, expected, expectedCode = null, testDate = '2026-10-01T00:00:00Z') => {
    const plan = ldBrand.pricing.find(p => p.name === name && p.period === period);
    if (!plan) return false;
    const cp = getBestCouponForPricing(ldBrand, plan, new Date(testDate));
    if (expected === null) {
      if (cp !== null) {
        console.error(\`ERROR: LINGDONG \${name} \${period} expected null coupon, got \${cp.code}\`);
        return false;
      }
    } else {
      if (!cp) {
        console.error(\`ERROR: LINGDONG \${name} \${period} expected coupon \${expectedCode}, got null\`);
        return false;
      }
      if (expectedCode && cp.code !== expectedCode) {
        console.error(\`ERROR: LINGDONG \${name} \${period} expected code \${expectedCode}, got \${cp.code}\`);
        return false;
      }
      const mult = getDiscountMultiplier(cp);
      const finalPrice = original * mult;
      if (Math.abs(finalPrice - expected) > 0.01) {
        console.error(\`ERROR: LINGDONG \${name} \${period} expected \${expected}, got \${finalPrice} (coupon: \${cp.code})\`);
        return false;
      }
    }
    return true;
  };
  
  let ldPricePass = true;
  
  // zq88 (8折, 年付及以上)
  if (!testLdCalc('拂风', '年付', 204, 163.2, 'zq88')) ldPricePass = false;
  if (!testLdCalc('穿云', '年付', 99, 79.2, 'zq88')) ldPricePass = false;
  if (!testLdCalc('凌霄', '三年付', 4860, 3888, 'zq88')) ldPricePass = false;
  
  // zq85 (85折, 半年付及以内)
  if (!testLdCalc('拂风', '月付', 20, 17, 'zq85')) ldPricePass = false;
  if (!testLdCalc('驭浪', '季付', 142.5, 121.125, 'zq85')) ldPricePass = false;
  if (!testLdCalc('破晓', '半年付', 540, 459, 'zq85')) ldPricePass = false;
  if (!testLdCalc('至尊私人定制', '月付', 680, 578, 'zq85')) ldPricePass = false;
  
  // nulls
  if (!testLdCalc('闲云', '一次性', 199, null)) ldPricePass = false;
  if (!testLdCalc('惊云', '一次性', 499, null)) ldPricePass = false;
  if (!testLdCalc('飞云', '一次性', 899, null)) ldPricePass = false;

  if (!ldPricePass) {
    ldErrors++; errors++;
  } else {
    console.log('LINGDONG COUPON CONSISTENCY: PASS');
  }
}`;

content = content.replace(oldLingdongTestRegex, newLingdongTests);

fs.writeFileSync(checkScript, content, 'utf8');
console.log('Modified check-coupon-consistency.mjs successfully');
