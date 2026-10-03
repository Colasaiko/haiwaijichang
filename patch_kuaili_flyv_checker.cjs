const fs = require('fs');

let content = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const newChecks = `
// --- KUAILI Consistency Test ---
const kuailiFile = files.find(f => f.endsWith('kuaili.md'));
if (kuailiFile) {
  let kuailiErrors = 0;
  const kuailiRaw = fs.readFileSync(kuailiFile, 'utf8');
  const kuailiMatter = matter(kuailiRaw);
  const kuailiBrand = kuailiMatter.data;
  
  if (kuailiBrand.pricing.length !== 28) {
    console.error('ERROR: KUAILI PRICING length expected 28, got ' + kuailiBrand.pricing.length);
    kuailiErrors++; errors++;
  }
  
  let validKuailiCoupons = 0;
  for (const plan of kuailiBrand.pricing) {
    const cp = getBestCoupon(kuailiBrand, plan, new Date('2026-10-01T00:00:00Z'));
    if (cp && cp.code === 'uufly888') {
      validKuailiCoupons++;
    }
  }
  if (validKuailiCoupons !== 28) {
    console.error('ERROR: KUAILI expected 28 eligible plans for uufly888, got ' + validKuailiCoupons);
    kuailiErrors++; errors++;
  }
  
  const testKuailiCalc = (name, period, original, expected) => {
    const plan = kuailiBrand.pricing.find(p => p.name === name && p.period === period);
    if (!plan) return false;
    const final = calculateFinalPrice(kuailiBrand, plan, new Date('2026-10-01T00:00:00Z'));
    if (expected === null) {
      if (final.price !== original) {
        console.error(\`ERROR: KUAILI \${name} \${period} expected null coupon (original \${original}), got \${final.price}\`);
        return false;
      }
    } else {
      if (Math.abs(final.price - expected) > 0.01) {
        console.error(\`ERROR: KUAILI \${name} \${period} expected \${expected}, got \${final.price}\`);
        return false;
      }
    }
    return true;
  };
  
  let kuailiPricePass = true;
  if (!testKuailiCalc('小狸基础版', '月付', 22, 17.60)) kuailiPricePass = false;
  if (!testKuailiCalc('灵狸标准版', '月付', 35, 28)) kuailiPricePass = false;
  if (!testKuailiCalc('夜狸强化版', '月付', 95, 76)) kuailiPricePass = false;
  if (!testKuailiCalc('天狸顶配版', '月付', 180, 144)) kuailiPricePass = false;
  
  const expectedKuailiResets = [15, 17, 20, 30, 90, 175];
  if (!kuailiBrand.resetPackages || kuailiBrand.resetPackages.length !== 6) {
    console.error('ERROR: KUAILI resetPackages length expected 6');
    kuailiPricePass = false;
  } else {
    const currentResets = kuailiBrand.resetPackages.map(r => r.price).sort((a,b)=>a-b);
    for (let i = 0; i < expectedKuailiResets.length; i++) {
      if (currentResets[i] !== expectedKuailiResets[i]) {
        console.error('ERROR: KUAILI reset package mismatch at index ' + i);
        kuailiPricePass = false;
      }
    }
  }

  if (!kuailiPricePass) {
    kuailiErrors++; errors++;
  }
}

// --- FLYV Consistency Test ---
const feivFile = files.find(f => f.endsWith('feiv.md'));
if (feivFile) {
  let feivErrors = 0;
  const feivRaw = fs.readFileSync(feivFile, 'utf8');
  const feivMatter = matter(feivRaw);
  const feivBrand = feivMatter.data;
  
  if (feivBrand.pricing.length !== 29) {
    console.error('ERROR: FLYV PRICING length expected 29, got ' + feivBrand.pricing.length);
    feivErrors++; errors++;
  }
  
  let validFeivCoupons = 0;
  for (const plan of feivBrand.pricing) {
    const cp = getBestCoupon(feivBrand, plan, new Date('2026-10-01T00:00:00Z'));
    if (cp && cp.code === 'fly20') {
      validFeivCoupons++;
    }
  }
  if (validFeivCoupons !== 24) {
    console.error('ERROR: FLYV expected 24 eligible plans for fly20, got ' + validFeivCoupons);
    feivErrors++; errors++;
  }
  
  const testFeivCalc = (name, period, original, expected) => {
    const plan = feivBrand.pricing.find(p => p.name === name && p.period === period);
    if (!plan) return false;
    const final = calculateFinalPrice(feivBrand, plan, new Date('2026-10-01T00:00:00Z'));
    if (expected === null) {
      if (final.coupon !== null) {
        console.error(\`ERROR: FLYV \${name} \${period} expected null coupon (original \${original}), got \${final.price} via \${final.coupon.code}\`);
        return false;
      }
    } else {
      if (Math.abs(final.price - expected) > 0.01) {
        console.error(\`ERROR: FLYV \${name} \${period} expected \${expected}, got \${final.price}\`);
        return false;
      }
    }
    return true;
  };
  
  let feivPricePass = true;
  if (!testFeivCalc('FlyV 会员 - 入门方案', '月付', 25, 20)) feivPricePass = false;
  if (!testFeivCalc('FlyV 会员 - 进阶方案', '月付', 50, 40)) feivPricePass = false;
  if (!testFeivCalc('FlyV 会员 - 高端方案', '月付', 110, 88)) feivPricePass = false;
  if (!testFeivCalc('FlyV 会员 - 商业方案', '月付', 190, 152)) feivPricePass = false;
  
  if (!testFeivCalc('FlyV 会员 - 年付标准轻量版', '年付', 99, null)) feivPricePass = false;
  if (!testFeivCalc('FlyV 会员 - 单次轻量版·小流量包', '一次性', 189, null)) feivPricePass = false;
  if (!testFeivCalc('FlyV 会员 - 单次轻量版·标准流量包', '一次性', 479, null)) feivPricePass = false;
  if (!testFeivCalc('FlyV 会员 - 单次轻量版·精英流量包', '一次性', 799, null)) feivPricePass = false;
  if (!testFeivCalc('FlyV 会员 - 原生IP·独享黄金专线', '月付', 680, null)) feivPricePass = false;
  
  if (!feivPricePass) {
    feivErrors++; errors++;
  }
}

if (errors === 0) console.log('COUPON CONSISTENCY: PASS');
`;

content = content.replace("if (errors === 0) console.log('COUPON CONSISTENCY: PASS');", newChecks);
fs.writeFileSync('scripts/check-coupon-consistency.mjs', content, 'utf8');

console.log('Checker patched.');
