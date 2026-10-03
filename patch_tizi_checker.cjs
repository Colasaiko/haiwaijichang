const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const checkScript = 'scripts/check-coupon-consistency.mjs';
let content = fs.readFileSync(checkScript, 'utf8');

const tiziTests = `
// --- TIZI Consistency Test ---
const tiziFile = files.find(f => f.endsWith('tizi.md'));
if (tiziFile) {
  let tiziErrors = 0;
  const tiziRaw = fs.readFileSync(path.join(brandsDir, tiziFile), 'utf8');
  const tiziMatter = matter(tiziRaw);
  const tiziBrand = tiziMatter.data;
  
  if (tiziBrand.pricing.length !== 29) {
    console.error('ERROR: TIZI pricing length expected 29, got ' + tiziBrand.pricing.length);
    tiziErrors++; errors++;
  }
  
  let validTiziCoupons = 0;
  for (const plan of tiziBrand.pricing) {
    const cp = getStandardCouponForPricing(tiziBrand, plan);
    if (cp && cp.code === 'tiziyun') {
      validTiziCoupons++;
    }
  }
  if (validTiziCoupons !== 24) {
    console.error('ERROR: TIZI expected 24 eligible plans for tiziyun, got ' + validTiziCoupons);
    tiziErrors++; errors++;
  }
  
  const testTiziCalc = (name, period, original, expected, testDate = '2026-10-01T00:00:00Z', expectCode = null) => {
    const plan = tiziBrand.pricing.find(p => p.name === name && p.period === period);
    if (!plan) return false;
    const cp = getBestCouponForPricing(tiziBrand, plan, new Date(testDate));
    if (expected === null) {
      if (cp !== null) {
        console.error(\`ERROR: TIZI \${name} \${period} expected null coupon, got \${cp.code}\`);
        return false;
      }
    } else {
      const mult = getDiscountMultiplier(cp);
      const finalPrice = original * mult;
      if (Math.abs(finalPrice - expected) > 0.01) {
        console.error(\`ERROR: TIZI \${name} \${period} expected \${expected}, got \${finalPrice}\`);
        return false;
      }
      if (expectCode && cp.code !== expectCode) {
         console.error(\`ERROR: TIZI \${name} \${period} expected code \${expectCode}, got \${cp.code}\`);
         return false;
      }
    }
    return true;
  };
  
  let tiziPricePass = true;
  const inEvent = '2026-10-01T00:00:00Z';
  const outEvent = '2026-11-01T00:00:00Z';

  // 月付活动期间最佳仍为tiziyun (20% > 15%)
  if (!testTiziCalc('初阶网络·基础视界', '月付', 25, 20, inEvent, 'tiziyun')) tiziPricePass = false;
  if (!testTiziCalc('中阶加速·极清多线', '月付', 60, 48, inEvent, 'tiziyun')) tiziPricePass = false;
  if (!testTiziCalc('高阶专线·全球智联', '月付', 110, 88, inEvent, 'tiziyun')) tiziPricePass = false;
  if (!testTiziCalc('顶阶商业·全球骨干', '月付', 190, 152, inEvent, 'tiziyun')) tiziPricePass = false;
  
  // 年付255→204，并确认活动期间最佳码为2hy80
  if (!testTiziCalc('初阶网络·基础视界', '年付', 255, 204, inEvent, '2hy80')) tiziPricePass = false;

  // 天梯随行/3个一次性包/私人定制均不得匹配
  if (!testTiziCalc('天梯随行', '年付', 89, null, inEvent)) tiziPricePass = false;
  if (!testTiziCalc('不限时包120GB', '一次性', 169, null, inEvent)) tiziPricePass = false;
  if (!testTiziCalc('私人定制', '月付', 680, null, inEvent)) tiziPricePass = false;

  if (!tiziPricePass) {
    tiziErrors++; errors++;
  } else {
    console.log('TIZI COUPON CONSISTENCY: PASS');
  }
}

if (errors === 0) console.log('COUPON CONSISTENCY: PASS');
console.log('CONTRADICTIONS: ' + errors);
if (errors > 0) process.exit(1);
`;

content = content.replace(/if \(errors === 0\) console\.log\('COUPON CONSISTENCY: PASS'\);[\s\S]*$/, tiziTests);
fs.writeFileSync(checkScript, content, 'utf8');
console.log('Appended TIZI tests');
