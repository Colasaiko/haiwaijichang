const fs = require('fs');
let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const regex = /if \(\!testGnCalc\('独享私人专线节点', '月付', 680, 544, 'GNTHP80'\)\) privatePass = false;\r?\n  if \(privatePass\) console\.log\('GUANGNIAN PRIVATE LINE BOTH COUPONS: PASS'\);\r?\n  else \{ console\.error\('ERROR: GUANGNIAN PRIVATE LINE test failed'\); gnErrors\+\+; errors\+\+; \}/;

const addTest = `
  let shortPass = true;
  if (!testGnCalc('光年梯 入门版', '月付', 18, 15.30, 'GNTHP85')) shortPass = false;
  if (!testGnCalc('光年梯 入门版', '季付', 50, 42.50, 'GNTHP85')) shortPass = false;
  if (!testGnCalc('光年梯 入门版', '半年付', 90, 76.50, 'GNTHP85')) shortPass = false;
  if (shortPass) console.log('GUANGNIAN SHORT PERIOD COUPON: PASS');
  else { console.error('ERROR: GUANGNIAN SHORT PERIOD COUPON test failed'); gnErrors++; errors++; }

  let longPass = true;
  if (!testGnCalc('光年梯 入门版', '年付', 160, 128.00, 'GNTHP80')) longPass = false;
  if (!testGnCalc('光年梯 入门版', '两年付', 300, 240.00, 'GNTHP80')) longPass = false;
  if (!testGnCalc('光年梯 入门版', '三年付', 420, 336.00, 'GNTHP80')) longPass = false;
  if (longPass) console.log('GUANGNIAN LONG PERIOD COUPON: PASS');
  else { console.error('ERROR: GUANGNIAN LONG PERIOD COUPON test failed'); gnErrors++; errors++; }

  const pPrivate = guangnianBrand.pricing.find(x => x.name === '独享私人专线节点' && x.period === '月付');
  const gn85 = guangnianBrand.temporaryCoupons.find(c => c.code === 'GNTHP85');
  let private85Pass = false;
  if (isCouponApplicableToPricing(guangnianBrand, gn85, pPrivate)) {
    private85Pass = true;
  }
  if (private85Pass) console.log('GUANGNIAN PRIVATE GNTHP85: PASS');
  else { console.error('ERROR: GUANGNIAN PRIVATE GNTHP85 test failed'); gnErrors++; errors++; }

  let privatePass = true;
  if (!testGnCalc('独享私人专线节点', '月付', 680, 544, 'GNTHP80')) privatePass = false;
  if (privatePass) console.log('GUANGNIAN PRIVATE BEST: PASS');
  else { console.error('ERROR: GUANGNIAN PRIVATE BEST test failed'); gnErrors++; errors++; }

  const postDate = new Date('2026-10-11T12:00:00Z');
  let postPass = true;
  guangnianBrand.pricing.forEach(p => {
    if (getBestCouponForPricing(guangnianBrand, p, postDate) !== null) {
      postPass = false;
    }
  });
  if (postPass) console.log('GUANGNIAN POST EXPIRY: PASS');
  else { console.error('ERROR: GUANGNIAN POST EXPIRY test failed'); gnErrors++; errors++; }
`;

c = c.replace(regex, addTest);
fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
