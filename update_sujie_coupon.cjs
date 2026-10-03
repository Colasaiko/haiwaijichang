const fs = require('fs');
const matter = require('gray-matter');

const file = 'src/content/brands/sujie.md';
const raw = fs.readFileSync(file, 'utf8');
const parsed = matter(raw);

parsed.data.coupon = {
  code: "sujie888",
  discountPercent: "20%",
  discount: "8折"
};

const output = matter.stringify(parsed.content || '', parsed.data);
fs.writeFileSync(file, output, 'utf8');
console.log('Updated sujie.md coupon structure');
