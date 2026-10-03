const fs = require('fs');
const matter = require('gray-matter');

const file = 'src/content/brands/lingdong.md';
let raw = fs.readFileSync(file, 'utf8');
let parsed = matter(raw);

// Replace "灵动网络" with "灵动云" in frontmatter strings
const replaceLD = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/灵动网络/g, '灵动云');
};

parsed.data.name = replaceLD(parsed.data.name);
parsed.data.seoTitle = replaceLD(parsed.data.seoTitle);
parsed.data.seoDescription = replaceLD(parsed.data.seoDescription);
parsed.data.h1 = replaceLD(parsed.data.h1);
parsed.data.heroDescription = replaceLD(parsed.data.heroDescription);

// Add startsAt to temporaryCoupons
if (parsed.data.temporaryCoupons) {
  parsed.data.temporaryCoupons.forEach(c => {
    if (c.code === 'zq88' || c.code === 'zq85') {
      c.startsAt = '2026-09-24T00:00:00+08:00';
    }
  });
}

// Replace "灵动网络" with "灵动云" in body
let newContent = replaceLD(parsed.content);

const output = matter.stringify(newContent, parsed.data);
fs.writeFileSync(file, output, 'utf8');
console.log('Modified lingdong.md successfully');
