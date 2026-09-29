const fs = require('fs');
const path = require('path');

const guidesDir = 'src/content/guides';
if (!fs.existsSync(guidesDir)) {
  fs.mkdirSync(guidesDir, { recursive: true });
}

const content = `---
title: "什么是 Clash 机场？"
description: "关于 Clash 机场的详细指南"
---

# 什么是 Clash 机场？

这是指南的正文。
`;
fs.writeFileSync(path.join(guidesDir, 'clash-what-is.md'), content);
console.log('Created guide md.');
