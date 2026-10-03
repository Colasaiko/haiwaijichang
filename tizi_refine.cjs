const fs = require('fs');
const matter = require('gray-matter');

const file = 'src/content/brands/tizi.md';
let raw = fs.readFileSync(file, 'utf8');
let parsed = matter(raw);
let data = parsed.data;

// Add new fields
data.established = "2025";
data.nodeCoverage = {
  total: "60+",
  regions: ["香港", "日本", "新加坡", "美国", "台湾"]
};
data.paymentMethods = ["支付宝", "USDT"];

// Update streaming and ai
if (!data.streamingSupport.includes("Disney+")) data.streamingSupport.push("Disney+");
if (!data.streamingSupport.includes("TikTok")) data.streamingSupport.push("TikTok");
if (!data.aiSupport.includes("Claude")) data.aiSupport.push("Claude");

// Remove ipType
if (data.ipType) {
  delete data.ipType;
}

// Update temporary coupons expiresAt
if (data.temporaryCoupons) {
  data.temporaryCoupons.forEach(c => {
    if (c.expiresAt || c.expiry) {
      c.expiresAt = "2026-10-10T23:59:59+08:00";
      delete c.expiry;
    }
  });
}

// Clean up "原生IP" from string fields in frontmatter
const cleanString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/原生\s*IP/gi, '').replace(/原生解锁/gi, '解锁').replace(/原生/g, '');
};

data.seoDescription = cleanString(data.seoDescription);
data.heroDescription = cleanString(data.heroDescription);
data.seoTitle = cleanString(data.seoTitle);
data.h1 = cleanString(data.h1);

if (data.features) {
  data.features = data.features.map(f => {
    let s = cleanString(f);
    // Cleanup any lingering weird spaces
    s = s.replace(/ IP 解锁/g, '解锁');
    s = s.replace(/  +/g, ' ').trim();
    return s;
  });
}

// Clean up content body
let content = cleanString(parsed.content || '');
content = content.replace(/ IP 解锁/gi, '解锁');

const output = matter.stringify(content, data);
fs.writeFileSync(file, output, 'utf8');
console.log('Refined tizi.md successfully');
