const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const targetStr = `  const eventDate = new Date('2026-10-01T12:00:00Z');

  function testGnCalc(plan, period, orig, expected, expectedCode) {`;

const replStr = `  let activeBestEligible = 0;
  let activeBestExcluded = 0;
  let gn80Matches = 0;
  let gn85Matches = 0;
  
  const eventDate = new Date('2026-10-01T12:00:00Z');

  guangnianBrand.pricing.forEach(p => {
    const cAct = getBestCouponForPricing(guangnianBrand, p, eventDate);
    if (cAct) activeBestEligible++; else activeBestExcluded++;

    const gn80 = guangnianBrand.temporaryCoupons.find(c => c.code === 'GNTHP80');
    const gn85 = guangnianBrand.temporaryCoupons.find(c => c.code === 'GNTHP85');
    if (isCouponApplicableToPricing(guangnianBrand, gn80, p)) gn80Matches++;
    if (isCouponApplicableToPricing(guangnianBrand, gn85, p)) gn85Matches++;
  });

  console.log(\`GUANGNIAN ACTIVE BEST COUPON ELIGIBLE: \${activeBestEligible}/25\`);
  console.log(\`GUANGNIAN ACTIVE BEST COUPON EXCLUDED: \${activeBestExcluded}/1\`);
  console.log(\`GUANGNIAN GNTHP80 MATCHES: \${gn80Matches}/13\`);
  console.log(\`GUANGNIAN GNTHP85 MATCHES: \${gn85Matches}/13\`);

  if (activeBestEligible !== 25 || activeBestExcluded !== 1 || gn80Matches !== 13 || gn85Matches !== 13) {
    gnErrors++; errors++;
  }

  function testGnCalc(plan, period, orig, expected, expectedCode) {`;

c = c.replace(targetStr, replStr);

const targetStr2 = `  let shortPass = true;`;
const replStr2 = `  if (testGnCalc('年付限时套餐', '年付', 89, null, null)) {
    console.log('GUANGNIAN SPECIAL ANNUAL EXCLUDED: PASS');
  } else {
    console.error('ERROR: GUANGNIAN SPECIAL ANNUAL EXCLUDED failed'); gnErrors++; errors++;
  }

  let shortPass = true;`;

c = c.replace(targetStr2, replStr2);

const targetStr3 = `  if (gnErrors === 0) console.log('GUANGNIAN COUPON CONSISTENCY: PASS');`;
const replStr3 = `  let resetPass = true;
  if (guangnianBrand.resetPackages && guangnianBrand.resetPackages.length === 6) {
    const rpMap = Object.fromEntries(guangnianBrand.resetPackages.map(r => [r.plan, r.price]));
    if (rpMap['年付限时套餐'] !== 18) resetPass = false;
    if (rpMap['光年梯 入门版'] !== 18) resetPass = false;
    if (rpMap['光年梯 晋级版'] !== 34) resetPass = false;
    if (rpMap['光年梯 专业版'] !== 68) resetPass = false;
    if (rpMap['光年梯 至尊版'] !== 130) resetPass = false;
    if (rpMap['独享私人专线节点'] !== 680) resetPass = false;
  } else { resetPass = false; }
  
  if (resetPass) console.log('GUANGNIAN RESET PACKAGES: PASS');
  else { console.error('ERROR: GUANGNIAN RESET PACKAGES failed'); gnErrors++; errors++; }

  if (gnErrors === 0) console.log('GUANGNIAN COUPON CONSISTENCY: PASS');`;

c = c.replace(targetStr3, replStr3);

// In PRIVATE BEST: PASS, also update to output the correct log if the user explicitly wants "GUANGNIAN PRIVATE BEST: PASS"
// Wait, my output already had "GUANGNIAN PRIVATE BEST: PASS".
// Yes, it was there. And the expected was 680 -> 544. Wait, does `testGnCalc('独享私人专线节点', '月付', 680, 544, 'GNTHP80')` do 544?
// Let's check testGnCalc. It checks `calc === expected`.

fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
