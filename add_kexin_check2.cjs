const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const kexinBlock = `// --- KEXIN Consistency Test ---
let kexinBrand = null;
if (fs.existsSync(path.join(brandsDir, 'kexin.md'))) {
  const kxContent = fs.readFileSync(path.join(brandsDir, 'kexin.md'), 'utf8');
  kexinBrand = matter(kxContent).data;
}

if (kexinBrand) {
  let kexinErrors = 0;
  if (kexinBrand.pricing.length !== 29) {
    console.error(\`ERROR: KEXIN PRICING count mismatch. Expected 29, got \${kexinBrand.pricing.length}\`);
    kexinErrors++; errors++;
  } else {
    console.log('KEXIN PRICING 29');
  }
  
  // Check resetPackages
  if (!kexinBrand.resetPackages || kexinBrand.resetPackages.length !== 7) {
    console.error('ERROR: KEXIN resetPackages mismatch. Expected 7.');
    kexinErrors++; errors++;
  }
  
  // Check key prices
  const expectedKexinPrices = {
    '基础版': { '月付': 25, '季付': 71.25, '半年付': 135, '年付': 255, '两年付': 480, '三年付': 630 },
    '标准版': { '月付': 50, '季付': 142.50, '半年付': 270, '年付': 510, '两年付': 960, '三年付': 1260 },
    '专业版': { '月付': 100, '季付': 285, '半年付': 540, '年付': 1020, '两年付': 1920, '三年付': 2520 },
    '旗舰版': { '月付': 200, '季付': 570, '半年付': 1080, '年付': 2040, '两年付': 3840, '三年付': 5400 }
  };

  let kexinPriceError = false;
  for (const [plan, periods] of Object.entries(expectedKexinPrices)) {
    for (const [period, expectedPrice] of Object.entries(periods)) {
      const pEntry = kexinBrand.pricing.find(x => x.name === plan && x.period === period);
      if (!pEntry) {
        console.error(\`ERROR: KEXIN missing \${plan} \${period}\`);
        kexinPriceError = true;
        continue;
      }
      const numericPrice = parseFloat(pEntry.price.replace(/[^0-9.]/g, ''));
      if (numericPrice !== expectedPrice) {
        console.error(\`ERROR: KEXIN \${plan} \${period} expected \${expectedPrice}, got \${numericPrice}\`);
        kexinPriceError = true;
      }
    }
  }
  
  if (kexinPriceError) { kexinErrors++; errors++; }
  if (kexinErrors === 0) console.log('KEXIN PRICE INTEGRITY: PASS');
}

`;

if (!c.includes('KEXIN Consistency Test')) {
  c = c.replace('// --- ERMAO Consistency Test ---', kexinBlock + '// --- ERMAO Consistency Test ---');
  fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
}
