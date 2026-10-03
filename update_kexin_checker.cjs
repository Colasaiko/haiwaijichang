const fs = require('fs');
let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const oldCheckReset = `  // Check resetPackages
  if (!kexinBrand.resetPackages || kexinBrand.resetPackages.length !== 7) {
    console.error('ERROR: KEXIN resetPackages mismatch. Expected 7.');
    kexinErrors++; errors++;
  }`;

const newCheckReset = `  if (kexinBrand.coupon) { console.error('ERROR: KEXIN should not have coupon'); kexinErrors++; errors++; }
  if (kexinBrand.temporaryCoupons && kexinBrand.temporaryCoupons.length > 0) { console.error('ERROR: KEXIN should not have temporaryCoupons'); kexinErrors++; errors++; }

  // Check resetPackages
  const expectedKexinReset = {
    '可信云年费小礼包': 15,
    '可信云月付小包': 20,
    '基础版': 22.5,
    '标准版': 45,
    '专业版': 90,
    '旗舰版': 180,
    '可信云轻量不限时': 50
  };
  
  if (!kexinBrand.resetPackages || kexinBrand.resetPackages.length !== 7) {
    console.error('ERROR: KEXIN resetPackages mismatch. Expected 7.');
    kexinErrors++; errors++;
  } else {
    kexinBrand.resetPackages.forEach(rp => {
      if (expectedKexinReset[rp.plan] !== rp.price) {
        console.error('ERROR: KEXIN reset package ' + rp.plan + ' expected ' + expectedKexinReset[rp.plan] + ' got ' + rp.price);
        kexinErrors++; errors++;
      }
    });
  }`;

c = c.replace(oldCheckReset, newCheckReset);
fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
