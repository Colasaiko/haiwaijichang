const fs = require('fs');

let c = fs.readFileSync('src/content/brands/jilian.md', 'utf8');

// 1. Move resetPackages out of visualData
c = c.replace(/  resetPackages:[\s\S]*?      price: 369\r?\n/, '');
c = c.replace('---\r\n\r\n##', `resetPackages:
  - plan: "限时年付套餐体验"
    price: 18
  - plan: "极连云 · 基础套餐"
    price: 18
  - plan: "极连云 · 进阶套餐"
    price: 32
  - plan: "极连云 · 旗舰套餐"
    price: 61
  - plan: "极连云 · 尊享套餐"
    price: 122
  - plan: "极连云 · 不限时套餐"
    price: 369
---

##`);
// If replace missed (UNIX newlines)
c = c.replace('---\n\n##', `resetPackages:
  - plan: "限时年付套餐体验"
    price: 18
  - plan: "极连云 · 基础套餐"
    price: 18
  - plan: "极连云 · 进阶套餐"
    price: 32
  - plan: "极连云 · 旗舰套餐"
    price: 61
  - plan: "极连云 · 尊享套餐"
    price: 122
  - plan: "极连云 · 不限时套餐"
    price: 369
---

##`);

// 2. nodeCoverage counts
const oldCounts = `  counts:
    - region: "香港"
      count: 20
    - region: "台湾"
      count: 10
    - region: "日本"
      count: 10
    - region: "新加坡"
      count: 10
    - region: "美国"
      count: 10
    - region: "泰国"
      count: 1
    - region: "德国"
      count: 1
    - region: "法国"
      count: 1
    - region: "英国"
      count: 1
    - region: "土耳其"
      count: 1`;
const newCounts = `  counts:
    香港: 20
    台湾: 10
    日本: 10
    新加坡: 10
    美国: 10
    泰国: 1
    德国: 1
    法国: 1
    英国: 1
    土耳其: 1`;
c = c.replace(oldCounts, newCounts);

// 3. temporaryCoupons manualActive
c = c.replace(/code: "2happy80"/, 'manualActive: true\n    code: "2happy80"');
c = c.replace(/code: "2happy85"/, 'manualActive: true\n    code: "2happy85"');

// 4. protocols
c = c.replace(/protocols:\r?\n  - "未确认协议\/存在资料冲突"\r?\n/, '');

// 5. Streaming
c = c.replace('结合原生 IP 支持以及全节点 ×1 倍率的 IPLC 专线，极连云在解锁各大主流流媒体服务（如 Netflix、Disney+ 等）、社交平台（如 TikTok）以及连接 ChatGPT 等生成式 AI 工具时具有极佳的支持。', '结合原生 IP 支持以及全节点 ×1 倍率的 IPLC 专线，极连云当前资料显示支持主流流媒体、TikTok与ChatGPT等使用场景。');

fs.writeFileSync('src/content/brands/jilian.md', c);
