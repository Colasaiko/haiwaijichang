const fs = require('fs');

const path = 'src/content/brands/firefly.md';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '### 使用 firefly 后年付版多少钱？\n\n按 8 折计算：¥76.80/年，折合约 ¥6.40/月。仍然是年付，不是月付。',
  '### Firefly年付版能用 firefly 优惠码吗？\n\n不能。年付版不适用该优惠码，必须按原价 ¥96 支付。'
);

fs.writeFileSync(path, content);
console.log('Fixed FAQ in firefly.md');
