const fs = require('fs');
const path = require('path');

const pagesDir = 'src/content/pages';
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

const pages = [
  'home', 'network', 'technology', 'use-cases', 'guides', 'help', 
  'status', 'about', 'faq', 'privacy', 'terms', 'brands'
];

pages.forEach(p => {
  const mdPath = path.join(pagesDir, `${p}.md`);
  if (!fs.existsSync(mdPath)) {
    const content = `---
title: "${p.charAt(0).toUpperCase() + p.slice(1)} - 海外机场推荐"
description: "这是 ${p} 页面的内容文件。"
---

# ${p.charAt(0).toUpperCase() + p.slice(1)}

这里是页面正文，此页面内容可以随时在此 Markdown 文件中修改，不会影响网站的 UI 模板结构。
`;
    fs.writeFileSync(mdPath, content);
  }
});

console.log('Created Markdown files for pages.');
