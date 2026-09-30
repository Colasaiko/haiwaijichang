const fs = require('fs');

const path = 'src/content/brands/lingmao.md';
let content = fs.readFileSync(path, 'utf8');

const featuresStr = `features:
  - "全IPLC专线，不限速，不限制客户端"
  - "原生IP解锁Netflix/Hulu/HBO/Disney等流媒体"
  - "解锁 ChatGPT，Gemini，TikTok"
`;

content = content.replace(/^order: 5\n/m, `order: 5\n${featuresStr}`);

fs.writeFileSync(path, content);
console.log('Added features to lingmao.md');
