const fs = require('fs');

const cePath = 'src/components/charts/CouponEligibilityMatrix.astro';
let ceContent = fs.readFileSync(cePath, 'utf8');

if (!ceContent.includes('const isEligible =')) {
  ceContent = ceContent.replace(/\{data\.map\(item => \(/g, `{data.map(item => {
      let isEligible = item.eligible;
      if (activeCoupon?.type === 'temporary') {
        if (activeCoupon.eligiblePlans && activeCoupon.eligiblePlans.length > 0) {
          isEligible = activeCoupon.eligiblePlans.includes(item.label);
        } else if (activeCoupon.excludedPlans && activeCoupon.excludedPlans.length > 0) {
          isEligible = !activeCoupon.excludedPlans.includes(item.label);
        }
      }
      return (`);
      
  ceContent = ceContent.replace(/\$\{item\.eligible \?/g, '${isEligible ?');
  ceContent = ceContent.replace(/\{item\.eligible \?/g, '{isEligible ?');
  ceContent = ceContent.replace(/<\/div>\n    \)\)\}/g, '</div>\n      );\n    })}');
  
  fs.writeFileSync(cePath, ceContent);
}

console.log('Eligibility matrix updated.');
