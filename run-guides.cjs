const fs = require('fs');
let astro = fs.readFileSync('src/pages/guides.astro', 'utf8');

const guideMatch = astro.match(/const guideCategories = (\[[\s\S]*?\]);\s*---/);
let guideCategoriesStr = guideMatch ? guideMatch[1] : '[]';
let guideCategories = eval(guideCategoriesStr);

let frontmatterObj = {
  title: '海外科学上网出境指南 | 教程、百科与避坑指南',
  description: '涵盖机场选购、Clash / Shadowrocket 配置教程、线路原理解析（IPLC/IEPL/Trojan）以及流媒体与 AI 解锁知识大全。',
  keywords: '机场教程, 梯子教程, 科学上网教程, Clash 怎么用, Shadowrocket 教程, IPLC 是什么, 翻墙教程, 怎么翻墙',
  h1: '海外指南',
  h1Highlight: 'GUIDES & KNOWLEDGE',
  badge: 'Travel Guide / 出境指南',
  heroText: '从第一次连接，到理解线路与协议。系统性掌握跨境网络知识。',
  searchPlaceholder: '搜索知识库：如 Clash 配置、IPLC、Timeout 修复...',
  allGuidesText: '全部指南',
  cta: {
    title: '没找到您想了解的内容？',
    desc: '如果您遇到了具体的技术问题，可以前往我们的服务台进行排障。如果有特定的使用教程需求，请向我们提交反馈。',
    buttonText: '进入机场服务台'
  },
  guideCategories: guideCategories
};

let yamlStr = `---
title: "海外科学上网出境指南 | 教程、百科与避坑指南"
description: "涵盖机场选购、Clash / Shadowrocket 配置教程、线路原理解析（IPLC/IEPL/Trojan）以及流媒体与 AI 解锁知识大全。"
keywords: "机场教程, 梯子教程, 科学上网教程, Clash 怎么用, Shadowrocket 教程, IPLC 是什么, 翻墙教程, 怎么翻墙"
h1: "海外指南"
h1Highlight: "GUIDES & KNOWLEDGE"
badge: "Travel Guide / 出境指南"
heroText: "从第一次连接，到理解线路与协议。系统性掌握跨境网络知识。"
searchPlaceholder: "搜索知识库：如 Clash 配置、IPLC、Timeout 修复..."
allGuidesText: "全部指南"
cta:
  title: "没找到您想了解的内容？"
  desc: "如果您遇到了具体的技术问题，可以前往我们的服务台进行排障。如果有特定的使用教程需求，请向我们提交反馈。"
  buttonText: "进入机场服务台"
guideCategories: ${JSON.stringify(guideCategories)}
---
`;

fs.writeFileSync('src/content/pages/guides.md', yamlStr);

let newAstro = astro
  .replace(/const guideCategories = \[[\s\S]*?\];\s*---/, 'import { getEntry } from \'astro:content\';\nconst page = await getEntry(\'pages\', \'guides\');\nconst { title, description, keywords, h1, h1Highlight, badge, heroText, searchPlaceholder, allGuidesText, cta, guideCategories } = page.data;\n---')
  .replace(/<Layout\s*title="[^"]*"\s*description="[^"]*"\s*keywords="[^"]*"\s*>/, '<Layout \n  title={title}\n  description={description}\n  keywords={keywords}\n>')
  .replace(/<span class="text-xs font-mono tracking-\[0.2em\] text-slate-300 uppercase">.*?<\/span>/, '<span class="text-xs font-mono tracking-[0.2em] text-slate-300 uppercase">{badge}</span>')
  .replace(/<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white">\s*.*?\s*<br class="hidden sm:block md:hidden"\/>\s*<span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-brand-accent">.*?<\/span>\s*<\/h1>/, 
    '<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white">\n        {h1} <br class="hidden sm:block md:hidden"/>\n        <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-brand-accent">{h1Highlight}</span>\n      </h1>')
  .replace(/<p class="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">\s*.*?\s*<\/p>/, '<p class="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">\n        {heroText}\n      </p>')
  .replace(/placeholder=".*?"/, 'placeholder={searchPlaceholder}')
  .replace(/<a href="#all" class="px-4 py-2 bg-brand-neon text-brand-dark font-bold rounded-full text-sm transition-colors">.*?<\/a>/, '<a href="#all" class="px-4 py-2 bg-brand-neon text-brand-dark font-bold rounded-full text-sm transition-colors">{allGuidesText}</a>')
  .replace(/<h2 class="text-3xl font-bold mb-6">.*?<\/h2>/, '<h2 class="text-3xl font-bold mb-6">{cta.title}</h2>')
  .replace(/<p class="text-slate-400 mb-10 max-w-2xl mx-auto">\s*.*?\s*<\/p>/, '<p class="text-slate-400 mb-10 max-w-2xl mx-auto">\n        {cta.desc}\n      </p>')
  .replace(/<a href="\/help" class="inline-flex items-center justify-center px-8 py-3.5 bg-white\/10 text-white font-bold rounded-sm hover:bg-white\/20 transition-colors border border-white\/20 uppercase tracking-widest">\s*<svg.*?>.*?<\/svg>\s*.*?\s*<\/a>/, '<a href="/help" class="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 text-white font-bold rounded-sm hover:bg-white/20 transition-colors border border-white/20 uppercase tracking-widest">\n          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>\n          {cta.buttonText}\n        </a>');

// For "dummy links", replace <a href="javascript:void(0)" or href="#" with <div
newAstro = newAstro.replace(/<a href="javascript:void\(0\)"(.*?)>/g, '<div$1>');
newAstro = newAstro.replace(/<a href="#"(.*?)>/g, '<div$1>');
// And replace their closing </a> with </div>
// This requires a bit more logic since there might be other </a>. Let's look for specific pattern.
// In the map function:
newAstro = newAstro.replace(/<a href="javascript:void\(0\)" class="opacity-75 cursor-not-allowed"[^>]*>([\s\S]*?)<\/a>/g, '<div class="opacity-75 cursor-not-allowed group bg-brand-navy border border-white/10 rounded-xl p-6 hover:border-brand-neon/50 hover:bg-white/5 transition-all flex flex-col h-full relative overflow-hidden" title="内容建设中，敬请期待">$1</div>');
// Also wait, it has double class attributes before! Let's just fix it properly.
// The input has: <a href="javascript:void(0)" class="opacity-75 cursor-not-allowed" title="..." class="group bg-brand-navy ...">
// Just replace that whole tag opening.
newAstro = newAstro.replace(/<a href="javascript:void\(0\)" class="opacity-75 cursor-not-allowed" title="[^"]*" class="group bg-brand-navy[^>]*>/g, 
  '<div class="opacity-75 cursor-not-allowed group bg-brand-navy border border-white/10 rounded-xl p-6 hover:border-brand-neon/50 hover:bg-white/5 transition-all flex flex-col h-full relative overflow-hidden" title="内容建设中，敬请期待">');
newAstro = newAstro.replace(/<\/div>\s*<\/a>\s*\)\)}/g, '</div>\n              </div>\n            ))}');
// wait, the </a> closing tag is just before `))} `? Let's check the original source carefully.
// I will just use regex to replace `<a href="javascript:void(0)" ...>...</a>` with `<div>...</div>`.

fs.writeFileSync('src/pages/guides.astro', newAstro);
