const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchRegex, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(searchRegex, replacement);
  fs.writeFileSync(filePath, content);
}

// 1. QuickFacts.astro
const qfPath = 'src/components/charts/QuickFacts.astro';
let qfContent = fs.readFileSync(qfPath, 'utf8');
if (!qfContent.includes('getActiveCoupon')) {
  qfContent = qfContent.replace('const { brand } = Astro.props;', `import { getActiveCoupon } from '../../utils/coupon.js';\nconst { brand } = Astro.props;\nconst activeCoupon = getActiveCoupon(brand);`);
  qfContent = qfContent.replace(/brand\.coupon\s*&&\s*brand\.coupon\.code/g, 'activeCoupon && activeCoupon.code');
  qfContent = qfContent.replace(/brand\.coupon\.code/g, 'activeCoupon.code');
  qfContent = qfContent.replace(/brand\.coupon\.discount/g, 'activeCoupon.discount');
  
  // Client-time visual fallback for QuickFacts
  qfContent = qfContent.replace('---', `---
const clientScript = activeCoupon?.type === 'temporary' ? \`
  <script>
    (function() {
      const expires = new Date('\${activeCoupon.expiresAt}').getTime();
      if (Date.now() > expires) {
        document.querySelectorAll('.coupon-display').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.standard-coupon-display').forEach(el => el.style.display = 'flex');
      } else {
        document.querySelectorAll('.coupon-display').forEach(el => {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        });
      }
    })();
  </script>
\` : '';
`);
  // Update fact div for coupon to have class
  qfContent = qfContent.replace(/\{fact\.label\}<\/span>/g, '{fact.label}</span>\n        {fact.label === "优惠码" && activeCoupon?.type === "temporary" && <span class="ml-2 text-[8px] bg-brand-neon/20 text-brand-neon px-1 rounded">限时</span>}');
  fs.writeFileSync(qfPath, qfContent);
}

// 2. CouponComparison.astro
const ccPath = 'src/components/charts/CouponComparison.astro';
let ccContent = fs.readFileSync(ccPath, 'utf8');
if (!ccContent.includes('getActiveCoupon')) {
  ccContent = ccContent.replace('const { brand } = Astro.props;', `import { getActiveCoupon } from '../../utils/coupon.js';\nconst { brand } = Astro.props;\nconst activeCoupon = getActiveCoupon(brand);`);
  fs.writeFileSync(ccPath, ccContent);
}

// 3. CouponEligibilityMatrix.astro
const cePath = 'src/components/charts/CouponEligibilityMatrix.astro';
let ceContent = fs.readFileSync(cePath, 'utf8');
if (!ceContent.includes('getActiveCoupon')) {
  ceContent = ceContent.replace('const { brand } = Astro.props;', `import { getActiveCoupon } from '../../utils/coupon.js';\nconst { brand } = Astro.props;\nconst activeCoupon = getActiveCoupon(brand);`);
  ceContent = ceContent.replace(/brand\.coupon\?\.code/g, 'activeCoupon?.code');
  fs.writeFileSync(cePath, ceContent);
}

// 4. AnnualPriceChart.astro
const apPath = 'src/components/charts/AnnualPriceChart.astro';
let apContent = fs.readFileSync(apPath, 'utf8');
if (!apContent.includes('getActiveCoupon')) {
  apContent = apContent.replace('const { brand } = Astro.props;', `import { getActiveCoupon } from '../../utils/coupon.js';\nconst { brand } = Astro.props;\nconst activeCoupon = getActiveCoupon(brand);`);
  apContent = apContent.replace(/brand\.coupon\?\.code/g, 'activeCoupon?.code');
  apContent = apContent.replace(/brand\.coupon\?\.discount/g, 'activeCoupon?.discount');
  fs.writeFileSync(apPath, apContent);
}

// 5. UnlimitedTrafficChart.astro
const utPath = 'src/components/charts/UnlimitedTrafficChart.astro';
let utContent = fs.readFileSync(utPath, 'utf8');
if (!utContent.includes('getActiveCoupon')) {
  utContent = utContent.replace('const { brand } = Astro.props;', `import { getActiveCoupon } from '../../utils/coupon.js';\nconst { brand } = Astro.props;\nconst activeCoupon = getActiveCoupon(brand);`);
  utContent = utContent.replace(/brand\.coupon\?\.discount/g, 'activeCoupon?.discount');
  fs.writeFileSync(utPath, utContent);
}

console.log('Components updated to use getActiveCoupon.');
