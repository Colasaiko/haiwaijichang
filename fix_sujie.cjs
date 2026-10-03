const fs = require('fs');
const matter = require('gray-matter');

const mapping = {
  "月": "月付",
  "季": "季付",
  "半年": "半年付",
  "年": "年付",
  "二年": "两年付",
  "两年": "两年付",
  "三年": "三年付",
  "一次性": "一次性"
};

const monthMap = {
  "月付": 1,
  "季付": 3,
  "半年付": 6,
  "年付": 12,
  "两年付": 24,
  "三年付": 36,
  "一次性": 0
};

const raw = fs.readFileSync('src/content/brands/sujie.md', 'utf8');
const parsed = matter(raw);
const data = parsed.data;

data.pricing.forEach(p => {
  if (mapping[p.period]) {
    p.period = mapping[p.period];
  }
});

for (const plan in data.visualData.periodPrices) {
  data.visualData.periodPrices[plan].forEach(p => {
    if (mapping[p.period]) {
      p.period = mapping[p.period];
    }
    if (monthMap[p.period] !== undefined) {
      p.months = monthMap[p.period];
    }
  });
}

const output = matter.stringify(parsed.content || '', data);
fs.writeFileSync('src/content/brands/sujie.md', output, 'utf8');
console.log('Fixed sujie.md');
