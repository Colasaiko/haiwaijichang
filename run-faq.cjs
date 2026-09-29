const fs = require('fs');
let astro = fs.readFileSync('src/pages/faq.astro', 'utf8');

const faqMatch = astro.match(/const faqCategories = (\[[\s\S]*?\]);\s*---/);
let faqCategoriesStr = faqMatch ? faqMatch[1] : '[]';
let faqCategories = eval(faqCategoriesStr);

let frontmatterObj = {
  title: '海外机场 FAQ | 2026 最全科学上网与梯子使用常见问题解答',
  description: '收录了有关海外机场、VPN、梯子推荐、Clash使用、节点线路、流媒体解锁以及按量计费等上百个常见问题解答，帮您避坑选对服务。',
  keywords: '机场推荐, 梯子推荐, 科学上网工具, Clash 机场推荐, 便宜机场推荐, IPLC 机场推荐, ChatGPT 机场推荐, 机场是什么, 机场常见问题',
  h1: '机场与专线网络',
  h1Highlight: '全景解答指南',
  badge: 'Knowledge Base / 常见问题',
  heroText: '从“机场是什么”到“如何导入 Clash 配置”，再到“IPLC 专线原理解析”，我们整理了数百个用户最关心的问题，助您快速排坑。',
  cta: {
    title: '没找到您的答案？',
    desc: '如果您遇到的问题没有在这里列出，或者您需要针对性的技术排障，请前往我们的服务台获取更详细的图文教程。',
    buttonText: '前往帮助中心服务台'
  },
  faqCategories: faqCategories
};

// Use JSON for frontmatter since Astro supports JSON frontmatter, or just serialize it as JSON which valid yaml also parses! Wait, yaml doesn't parse raw JSON easily for root object if we want standard frontmatter. Actually, Astro parses JSON frontmatter perfectly if you put it between `---`! No wait, Astro uses yaml. We can stringify to JSON, but JSON is a subset of YAML! So `--- \n { ... } \n ---` should work in Astro if we don't have frontmatter wrapper. Actually, better to just write a simple yaml serializer or just manually write it.
let yamlStr = `---
title: "海外机场 FAQ | 2026 最全科学上网与梯子使用常见问题解答"
description: "收录了有关海外机场、VPN、梯子推荐、Clash使用、节点线路、流媒体解锁以及按量计费等上百个常见问题解答，帮您避坑选对服务。"
keywords: "机场推荐, 梯子推荐, 科学上网工具, Clash 机场推荐, 便宜机场推荐, IPLC 机场推荐, ChatGPT 机场推荐, 机场是什么, 机场常见问题"
h1: "机场与专线网络"
h1Highlight: "全景解答指南"
badge: "Knowledge Base / 常见问题"
heroText: "从“机场是什么”到“如何导入 Clash 配置”，再到“IPLC 专线原理解析”，我们整理了数百个用户最关心的问题，助您快速排坑。"
cta:
  title: "没找到您的答案？"
  desc: "如果您遇到的问题没有在这里列出，或者您需要针对性的技术排障，请前往我们的服务台获取更详细的图文教程。"
  buttonText: "前往帮助中心服务台"
faqCategories: ${JSON.stringify(faqCategories)}
---
`;

fs.writeFileSync('src/content/pages/faq.md', yamlStr);

let newAstro = astro
  .replace(/const faqCategories = \[[\s\S]*?\];\s*---/, 'import { getEntry } from \'astro:content\';\nconst page = await getEntry(\'pages\', \'faq\');\nconst { title, description, keywords, h1, h1Highlight, badge, heroText, cta, faqCategories } = page.data;\n---')
  .replace(/<Layout\s*title="[^"]*"\s*description="[^"]*"\s*keywords="[^"]*"\s*>/, '<Layout \n  title={title}\n  description={description}\n  keywords={keywords}\n>')
  .replace(/<span class="text-xs font-mono tracking-\[0.2em\] text-slate-300 uppercase">.*?<\/span>/, '<span class="text-xs font-mono tracking-[0.2em] text-slate-300 uppercase">{badge}</span>')
  .replace(/<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">\s*.*?\s*<br class="hidden sm:block md:hidden"\/>\s*<span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-brand-accent">.*?<\/span>\s*<\/h1>/, 
    '<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">\n        {h1}<br class="hidden sm:block md:hidden"/>\n        <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-brand-accent">{h1Highlight}</span>\n      </h1>')
  .replace(/<p class="text-lg text-slate-400 max-w-2xl mx-auto">\s*.*?\s*<\/p>/, '<p class="text-lg text-slate-400 max-w-2xl mx-auto">\n        {heroText}\n      </p>')
  .replace(/<h2 class="text-3xl font-bold mb-6\">.*?<\/h2>/, '<h2 class="text-3xl font-bold mb-6">{cta.title}</h2>')
  .replace(/<p class="text-slate-400 mb-10\">.*?<\/p>/, '<p class="text-slate-400 mb-10">{cta.desc}</p>')
  .replace(/<a href="\/help" class="inline-flex items-center justify-center px-8 py-3.5 bg-brand-neon text-brand-dark font-bold rounded-sm hover:bg-brand-neon\/90 transition-colors uppercase tracking-widest">\s*.*?\s*<\/a>/, '<a href="/help" class="inline-flex items-center justify-center px-8 py-3.5 bg-brand-neon text-brand-dark font-bold rounded-sm hover:bg-brand-neon/90 transition-colors uppercase tracking-widest">\n        {cta.buttonText}\n      </a>');

fs.writeFileSync('src/pages/faq.astro', newAstro);
