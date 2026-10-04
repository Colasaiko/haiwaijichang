const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const checkScript = 'scripts/check-coupon-consistency.mjs';
let content = fs.readFileSync(checkScript, 'utf8');

const newTests = `
// --- NANOCLOUD Consistency Test ---
const nanoFile = files.find(f => f.endsWith('nanocloud.md'));
if (nanoFile) {
  let ncErrors = 0;
  const ncRaw = fs.readFileSync(path.join(brandsDir, nanoFile), 'utf8');
  const ncBrand = matter(ncRaw).data;
  
  if (ncBrand.pricing.length !== 8) {
    console.error('ERROR: NANOCLOUD pricing length expected 8, got ' + ncBrand.pricing.length);
    ncErrors++; errors++;
  }
  
  if (ncBrand.coupon || (ncBrand.temporaryCoupons && ncBrand.temporaryCoupons.length > 0)) {
    console.error('ERROR: NANOCLOUD must not have any coupons');
    ncErrors++; errors++;
  }
  
  const ncExpected = {
    '猎户座': { '月付': 1, '年付': 12 },
    '白羊座': { '月付': 10, '年付': 120 },
    '双鱼座': { '月付': 15, '年付': 180 },
    '射手座': { '月付': 20, '年付': 240 }
  };
  
  for (const p of ncBrand.pricing) {
    let pNum = parseFloat(p.price.replace(/[¥,]/g, ''));
    if (ncExpected[p.name] && ncExpected[p.name][p.period]) {
      if (Math.abs(pNum - ncExpected[p.name][p.period]) > 0.01) {
        console.error(\`ERROR: NANOCLOUD \${p.name} \${p.period} expected \${ncExpected[p.name][p.period]}, got \${pNum}\`);
        ncErrors++; errors++;
      }
    } else {
      console.error(\`ERROR: NANOCLOUD unexpected plan \${p.name} \${p.period}\`);
      ncErrors++; errors++;
    }
  }
  
  if (ncErrors === 0) console.log('NANOCLOUD PRICING: PASS');
}

// --- PHANTOM Consistency Test ---
const phanFile = files.find(f => f.endsWith('phantom.md'));
if (phanFile) {
  let phErrors = 0;
  const phRaw = fs.readFileSync(path.join(brandsDir, phanFile), 'utf8');
  const phBrand = matter(phRaw).data;
  
  if (phBrand.pricing.length !== 6) {
    console.error('ERROR: PHANTOM pricing length expected 6, got ' + phBrand.pricing.length);
    phErrors++; errors++;
  }
  
  if (phBrand.coupon || (phBrand.temporaryCoupons && phBrand.temporaryCoupons.length > 0)) {
    console.error('ERROR: PHANTOM must not have any coupons');
    phErrors++; errors++;
  }
  
  const phExpected = {
    '天蝎座': { '月付': 1, '年付': 12 },
    '水瓶座': { '月付': 10, '年付': 120 },
    '双子座': { '月付': 20, '年付': 240 }
  };
  
  for (const p of phBrand.pricing) {
    let pNum = parseFloat(p.price.replace(/[¥,]/g, ''));
    if (phExpected[p.name] && phExpected[p.name][p.period]) {
      if (Math.abs(pNum - phExpected[p.name][p.period]) > 0.01) {
        console.error(\`ERROR: PHANTOM \${p.name} \${p.period} expected \${phExpected[p.name][p.period]}, got \${pNum}\`);
        phErrors++; errors++;
      }
    } else {
      console.error(\`ERROR: PHANTOM unexpected plan \${p.name} \${p.period}\`);
      phErrors++; errors++;
    }
  }
  
  if (phErrors === 0) console.log('PHANTOM PRICING: PASS');
}
`;

content = content.replace(/if \(errors === 0\) console\.log\('COUPON CONSISTENCY: PASS'\);[\s\S]*$/, newTests + '\nif (errors === 0) console.log(\'COUPON CONSISTENCY: PASS\');\nconsole.log(\'CONTRADICTIONS: \' + errors);\nif (errors > 0) process.exit(1);\n');
fs.writeFileSync(checkScript, content, 'utf8');
console.log('Appended NANO and PHANTOM tests');
