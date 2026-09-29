const fs = require('fs');
let astro = fs.readFileSync('src/pages/help.astro', 'utf8');

const categoriesMatch = astro.match(/const categories = (\[[\s\S]*?\]);\s*---/);
let categoriesStr = categoriesMatch ? categoriesMatch[1] : '[]';
let categories = eval(categoriesStr);

let frontmatterObj = {
  title: '服务台与支持 | 海外机场技术工单与教程',
  description: '全平台客户端下载指引、多场景翻墙配置建议以及标准故障排查流程（Troubleshooting）。',
  keywords: '机场服务台, 机场客服, 梯子教程, 翻墙故障排查, Clash 下载, V2ray 下载, Shadowrocket 下载',
  h1: '服务台与支持中心',
  badge: 'Support Desk / 服务台',
  heroText: '在这里，您可以找到全平台的客户端下载指南，或是按场景浏览具体的配置建议。',
  quickLinks: [
    { name: '常见问题解答 (FAQ)', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', href: '/faq' },
    { name: '测速与评测博客', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', href: '/blog' },
    { name: 'TG 交流群组', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z', href: '#' }
  ],
  routeHelpLinkText: '前往技术与原理解析 &rarr;',
  scenarioHelpLinkText: '浏览场景与目的地大厅 &rarr;',
  troubleshooting: {
    badge: 'Troubleshooting',
    title: '如何进行标准故障排查？',
    desc: '当您遇到“已连接但打不开网页”时，请不要立刻重装软件，尝试遵循以下机场地勤排查步骤：',
    steps: [
      { step: "Step 1", title: "本地网络", desc: "检查您的宽带或WiFi是否本身断网" },
      { step: "Step 2", title: "更新订阅", desc: "在客户端中点击更新，获取最新可用节点" },
      { step: "Step 3", title: "更换线路", desc: "切换到不同国家或不同标识的备用节点" },
      { step: "Step 4", title: "重启应用", desc: "完全退出客户端并重新以管理员身份运行" },
      { step: "Step 5", title: "系统代理", desc: "检查操作系统的代理设置是否被正确接管" }
    ]
  },
  contact: {
    title: '商业合作与联系',
    desc: '如果您有任何商业合作意向、资源对接需求或品牌建议，欢迎随时通过以下方式与我们取得联系。期待与您的合作！',
    telegram: 'Telegram: @ColaSaiko15',
    email: 'Email: colasaiko15@gmail.com'
  },
  categories: categories
};

let yamlStr = `---
title: "服务台与支持 | 海外机场技术工单与教程"
description: "全平台客户端下载指引、多场景翻墙配置建议以及标准故障排查流程（Troubleshooting）。"
keywords: "机场服务台, 机场客服, 梯子教程, 翻墙故障排查, Clash 下载, V2ray 下载, Shadowrocket 下载"
h1: "服务台与支持中心"
badge: "Support Desk / 服务台"
heroText: "在这里，您可以找到全平台的客户端下载指南，或是按场景浏览具体的配置建议。"
routeHelpLinkText: "前往技术与原理解析 &rarr;"
scenarioHelpLinkText: "浏览场景与目的地大厅 &rarr;"
troubleshooting:
  badge: "Troubleshooting"
  title: "如何进行标准故障排查？"
  desc: "当您遇到“已连接但打不开网页”时，请不要立刻重装软件，尝试遵循以下机场地勤排查步骤："
  steps:
    - step: "Step 1"
      title: "本地网络"
      desc: "检查您的宽带或WiFi是否本身断网"
    - step: "Step 2"
      title: "更新订阅"
      desc: "在客户端中点击更新，获取最新可用节点"
    - step: "Step 3"
      title: "更换线路"
      desc: "切换到不同国家或不同标识的备用节点"
    - step: "Step 4"
      title: "重启应用"
      desc: "完全退出客户端并重新以管理员身份运行"
    - step: "Step 5"
      title: "系统代理"
      desc: "检查操作系统的代理设置是否被正确接管"
contact:
  title: "商业合作与联系"
  desc: "如果您有任何商业合作意向、资源对接需求或品牌建议，欢迎随时通过以下方式与我们取得联系。期待与您的合作！"
  telegram: "Telegram: @ColaSaiko15"
  email: "Email: colasaiko15@gmail.com"
categories: ${JSON.stringify(categories)}
quickLinks:
  - name: "常见问题解答 (FAQ)"
    icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    href: "/faq"
  - name: "测速与评测博客"
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
    href: "/blog"
  - name: "TG 交流群组"
    icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
    href: "#"
---
`;

fs.writeFileSync('src/content/pages/help.md', yamlStr);

let newAstro = astro
  .replace(/const categories = \[[\s\S]*?\];\s*---/, 'import { getEntry } from \'astro:content\';\nconst page = await getEntry(\'pages\', \'help\');\nconst { title, description, keywords, h1, badge, heroText, quickLinks, routeHelpLinkText, scenarioHelpLinkText, troubleshooting, contact, categories } = page.data;\n---')
  .replace(/<Layout\s*title="[^"]*"\s*description="[^"]*"\s*keywords="[^"]*"\s*>/, '<Layout \n  title={title}\n  description={description}\n  keywords={keywords}\n>')
  .replace(/<span class="text-xs font-mono tracking-\[0.2em\] text-slate-300 uppercase">.*?<\/span>/, '<span class="text-xs font-mono tracking-[0.2em] text-slate-300 uppercase">{badge}</span>')
  .replace(/<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">.*?<\/h1>/, '<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">{h1}</h1>')
  .replace(/<p class="text-lg text-slate-400">.*?<\/p>/, '<p class="text-lg text-slate-400">{heroText}</p>')
  .replace(/<div class="grid grid-cols-1 md:grid-cols-3 gap-4">\s*\{\[\s*\{ name: "常见问题解答 \(FAQ\)",.*?\s*\}\s*\]\.map\(topic => \(/g, '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">\n          {quickLinks.map(topic => (')
  .replace(/鍓嶅線鎶€鏈笌鍘熺悊瑙ｆ瀽 &rarr;/, '{routeHelpLinkText}')
  .replace(/娴忚鍦烘櫙涓庣洰鐨勫湴澶у巺 &rarr;/, '{scenarioHelpLinkText}')
  .replace(/<h2 class="text-sm font-mono tracking-widest text-brand-accent uppercase mb-2">Troubleshooting<\/h2>/, '<h2 class="text-sm font-mono tracking-widest text-brand-accent uppercase mb-2">{troubleshooting.badge}</h2>')
  .replace(/<h3 class="text-3xl font-bold">濡備綍杩涜鏍囧噯鏁呴殰鎺掓煡锛?<\/h3>/, '<h3 class="text-3xl font-bold">{troubleshooting.title}</h3>')
  .replace(/<p class="text-slate-400 mt-4">.*?<\/p>/, '<p class="text-slate-400 mt-4">{troubleshooting.desc}</p>')
  .replace(/\{\[\s*\{\s*step:.*?\s*\}\s*\].map\(item => \(/, '{troubleshooting.steps.map(item => (')
  .replace(/<h2 class="text-3xl font-bold mb-4">.*?<\/h2>/, '<h2 class="text-3xl font-bold mb-4">{contact.title}</h2>')
  .replace(/<p class="text-slate-400 mb-10 max-w-xl mx-auto">\s*.*?\s*<\/p>/, '<p class="text-slate-400 mb-10 max-w-xl mx-auto">\n        {contact.desc}\n      </p>')
  .replace(/Telegram: @ColaSaiko15/g, '{contact.telegram}')
  .replace(/Email: colasaiko15@gmail\.com/g, '{contact.email}');

// Fix quickLinks match regex that didn't work because of dot all matching
newAstro = newAstro.replace(/\{\[\s*\{\s*name:\s*"常见问题解答[\s\S]*?\]\.map\(topic => \(/, '{quickLinks.map(topic => (');

fs.writeFileSync('src/pages/help.astro', newAstro);
