const fs = require('fs');

let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

c = c.replace('if (jilianBrand) {', `
let jilianBrand = null;
if (fs.existsSync(path.join(brandsDir, 'jilian.md'))) {
  const jlContent = fs.readFileSync(path.join(brandsDir, 'jilian.md'), 'utf8');
  jilianBrand = matter(jlContent).data;
}
if (jilianBrand) {
`);

fs.writeFileSync('scripts/check-coupon-consistency.mjs', c);
