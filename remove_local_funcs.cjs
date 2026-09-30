const fs = require('fs');

const files = [
  'src/components/charts/AnnualPriceChart.astro',
  'src/components/charts/CouponComparison.astro',
  'src/components/charts/UnlimitedTrafficChart.astro'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the function and remove it
  // function getDiscountMultiplier(coupon) { ... }
  const regex = /function getDiscountMultiplier\(coupon\) \{[\s\S]*?return 1;\n\}\n/g;
  content = content.replace(regex, '');
  
  fs.writeFileSync(file, content);
  console.log(`Cleaned ${file}`);
});
