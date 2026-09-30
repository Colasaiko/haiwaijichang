const fs = require('fs');
const path = 'src/pages/brands/[slug].astro';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes("import { getBestCouponForPricing, getDiscountMultiplier } from '../../utils/coupon.js';")) {
  content = content.replace("import BrandDataDashboard from '../../components/BrandDataDashboard.astro';", "import BrandDataDashboard from '../../components/BrandDataDashboard.astro';\nimport { getBestCouponForPricing, getDiscountMultiplier } from '../../utils/coupon.js';");
}

fs.writeFileSync(path, content);
console.log('Fixed slug.astro imports');
