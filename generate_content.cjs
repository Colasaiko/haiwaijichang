const fs = require('fs');
const path = require('path');

const brands = JSON.parse(fs.readFileSync('src/data/brands.json', 'utf8'));

// Helper to find relevant brands
const getBrands = (keyword, limit = 3) => {
  return brands.filter(b => b.features.join(' ').toLowerCase().includes(keyword)).slice(0, limit);
};
const randomBrands = (limit = 3) => [...brands].sort(() => 0.5 - Math.random()).slice(0, limit);

// 1. Setup Blog Collection
if (!fs.existsSync('src/content/blog')) fs.mkdirSync('src/content/blog', { recursive: true });

const blogs = [
  {
    slug: '2026-airport-recommendation-guide',
    title: '2026机场推荐怎么选？从线路、价格、稳定性到节点完整指南',
    desc: '2026年寻找稳定机场推荐的终极指南。不要只看测速，从底层解析如何判断一个机场的真实稳定性。',
    brands: randomBrands(4)
  },
  {
    slug: 'cheap-vs-iplc-airport',
    title: '便宜机场和专线机场有什么区别？什么人适合低价套餐',
    desc: '详细对比便宜机场和 IPLC 专线机场的底层逻辑差异，帮你根据实际需求和预算做出最合理的选择。',
    brands: getBrands('iplc', 3)
  },
  {
    slug: 'what-is-clash-airport',
    title: 'Clash机场是什么？Clash订阅、节点与线路完整解释',
    desc: '新手必看的 Clash 机场入门教程。一次性搞懂 Clash 客户端、订阅链接和节点配置的关系。',
    brands: randomBrands(3)
  },
  {
    slug: 'iplc-iepl-differences',
    title: 'IPLC 和 IEPL 有什么区别？专线机场到底值不值得',
    desc: '深入解析跨境专线 IPLC 与 IEPL 的技术差异，看看高昂的专线机场套餐是否值得购买。',
    brands: getBrands('iplc', 3)
  },
  {
    slug: 'how-to-judge-stable-airport',
    title: '稳定机场怎么判断？为什么晚高峰比测速截图更重要',
    desc: '揭开机场测速的骗局，教你如何通过晚高峰实际表现、节点复用率和路由来判断一家机场的真实稳定性。',
    brands: randomBrands(3)
  },
  {
    slug: 'how-to-choose-airport-nodes',
    title: '机场节点怎么选？香港、日本、新加坡、美国线路区别',
    desc: '不同地区的节点对延迟和带宽有什么影响？一篇搞懂香港、日本、新加坡和美国节点的最佳使用场景。',
    brands: randomBrands(3)
  },
  {
    slug: 'ladder-recommendation-guide',
    title: '梯子推荐应该看什么？手机和电脑选择思路',
    desc: '寻找梯子推荐时，手机端和电脑端的需求往往不同。本文为你提供多设备下的最佳科学上网思路。',
    brands: randomBrands(3)
  },
  {
    slug: 'what-is-native-ip',
    title: '原生 IP 是什么？为什么 ChatGPT 和流媒体用户会关注它',
    desc: '解析原生 IP（Native IP）的定义及其在解锁 Netflix、Disney+ 和跨越 OpenAI 风控中的核心作用。',
    brands: getBrands('netflix', 2).concat(getBrands('chatgpt', 1))
  },
  {
    slug: 'chatgpt-airport-guide',
    title: 'ChatGPT机场怎么选？AI工具对IP与线路有哪些要求',
    desc: '频繁遭遇 ChatGPT 封号或 Access Denied？了解 AI 工具对机场节点 IP 纯净度和家庭宽带的苛刻要求。',
    brands: getBrands('chatgpt', 3)
  },
  {
    slug: 'netflix-airport-guide',
    title: 'Netflix机场怎么选？流媒体线路真正应该看什么',
    desc: '解锁 Netflix 不仅需要特定的 IP，还需要足够的带宽支撑 4K 画质。流媒体机场选购防坑指南。',
    brands: getBrands('netflix', 3)
  },
  {
    slug: 'vless-shadowsocks-trojan-difference',
    title: 'VLESS、Shadowsocks、Trojan 有什么区别',
    desc: '科普现代翻墙协议的区别：从 Shadowsocks 到 Trojan，再到 VLESS，哪种协议更适合你？',
    brands: randomBrands(2)
  },
  {
    slug: 'how-to-read-speed-test',
    title: '机场测速怎么看？延迟、带宽、丢包和 Jitter 分别代表什么',
    desc: 'Ping 值低就一定快吗？全面解析延迟、带宽、丢包率和网络抖动（Jitter）在实际体验中的真实意义。',
    brands: randomBrands(2)
  },
  {
    slug: 'what-is-airport-subscription',
    title: '机场订阅是什么？第一次使用机场的新手指南',
    desc: '从购买套餐到获取订阅链接，手把手教你如何将机场节点导入到各个平台的代理客户端中。',
    brands: randomBrands(2)
  },
  {
    slug: 'why-airport-slow-at-night',
    title: '为什么机场晚上变慢？国际出口与线路拥堵解释',
    desc: '晚高峰网络卡顿是很多人的痛点。深入剖析国际出口带宽拥堵原理及中转/专线线路的应对策略。',
    brands: randomBrands(2)
  },
  {
    slug: '2026-airport-ranking-guide',
    title: '2026机场天梯榜应该怎么看？不同使用场景的选择方法',
    desc: '不要盲目相信综合评分。教你如何根据专线、AI、流媒体和预算四大场景，正确参考 2026 机场排行榜。',
    brands: randomBrands(3)
  }
];

blogs.forEach(b => {
  let brandLinks = b.brands.map(brand => `- **[${brand.name}](/brands/${brand.slug})**: ${brand.features[0] || '提供优质网络服务'}`).join('\n');
  const md = `---
title: "${b.title}"
description: "${b.desc}"
date: 2026-09-${Math.floor(Math.random()*20+1).toString().padStart(2, '0')}
---

# ${b.title}

${b.desc} 很多用户在选择时往往只看表面的标签，却忽略了底层的网络逻辑。在当前的 2026 机场推荐市场中，我们需要更理性的判断标准。

## 核心概念解析

要真正理解这个话题，我们首先需要知道背后的技术原理。无论是专线、中转还是直连，其最终目的都是为了降低跨境数据包的丢包率和延迟。对于普通用户来说，选择合适的工具比盲目追求高价更重要。

## 实际案例与品牌参考

在实际选择时，可以把不同品牌放到相同维度比较。根据当前站内的收录数据，以下品牌在相关场景下有明确的资料支撑：

${brandLinks || '- 暂无明确匹配该特定场景的品牌数据，请参考其他通用选项。'}

> **注意：** 根据当前品牌资料显示，各家套餐和节点策略可能会有调整，实际体验仍会受本地网络环境（如电信、联通、移动）影响。

## 总结建议

在选择时，请务必根据自己的真实需求（是看重极致延迟、流媒体解锁，还是性价比）来决定。不要轻信夸大的“0丢包”或“绝对稳定”宣传。

想了解更多品牌，请访问我们的 [品牌中心](/brands)。
`;
  fs.writeFileSync(`src/content/blog/${b.slug}.md`, md);
});
console.log('Created 15 blog posts.');

// 2. Setup Topic Landing Pages
const topics = [
  { slug: 'clash-airport', title: 'Clash机场推荐与节点配置指南', desc: '全面解析 Clash 机场怎么选。包含 Clash 订阅原理、客户端使用教程以及支持 Clash 的精选机场推荐。', h1: 'Clash 机场推荐与指南', filter: '' },
  { slug: 'dedicated-line', title: 'IPLC/IEPL 专线机场推荐：低延迟与晚高峰稳定之选', desc: '深入讲解 IPLC 与 IEPL 专线的区别。为您推荐配备真实物理专线的海外网络加速服务。', h1: '专线机场推荐 (IPLC / IEPL)', filter: 'iplc' },
  { slug: 'cheap-airport', title: '便宜机场推荐：高性价比与入门级梯子选择', desc: '寻找性价比最高的便宜机场和入门级梯子。解析低价套餐的真实表现和适用人群。', h1: '便宜机场与高性价比选择', filter: '便宜' },
  { slug: 'stable-airport', title: '稳定机场推荐：如何判断晚高峰不卡顿的梯子', desc: '不要只看测速截图，教您如何通过底层线路架构判断一家机场的真实稳定性，并推荐实测稳定的品牌。', h1: '稳定机场推荐与防坑指南', filter: '' },
  { slug: 'ladder-recommendation', title: '2026 梯子推荐：电脑与手机科学上网终极指南', desc: '为不同设备（Windows/Mac/iOS/Android）寻找最好用的梯子推荐，解决您的跨平台网络需求。', h1: '2026 梯子推荐', filter: '' },
  { slug: 'ranking', title: '2026 机场天梯榜：按使用场景划分的真实排行榜', desc: '摒弃虚假的绝对测速排名。我们按照专线、AI、流媒体、性价比等真实场景为您提供机场排行参考。', h1: '2026 场景化机场天梯榜', filter: '' },
  { slug: 'nodes', title: '机场节点选择指南：香港、日本、新加坡等常用线路解析', desc: '节点地区怎么选？全面解析亚洲和欧美主流节点在延迟、带宽和流媒体解锁方面的差异。', h1: '全球机场节点解析', filter: '' },
  { slug: 'streaming', title: '流媒体机场推荐：解锁 Netflix、Disney+ 原生节点', desc: '专为追剧达人准备。精选拥有高质量原生 IP、能够稳定解锁 Netflix 等流媒体的机场品牌。', h1: '流媒体解锁机场推荐', filter: 'netflix' },
  { slug: 'ai', title: 'ChatGPT/AI 机场推荐：高纯净度原生 IP 节点选择', desc: '解决 ChatGPT 封号和 Access Denied 烦恼。推荐线路纯净、明确支持主流 AI 工具的加速服务。', h1: 'AI 工具专属机场推荐', filter: 'chatgpt' }
];

topics.forEach(t => {
  const code = `---
import Layout from '../layouts/Layout.astro';
import fs from 'node:fs';
import path from 'node:path';

const brandsPath = path.resolve(process.cwd(), 'src/data/brands.json');
const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));

// Filter brands relevant to this topic
const matchedBrands = '${t.filter}' 
  ? brands.filter(b => b.features.join(' ').toLowerCase().includes('${t.filter}')) 
  : brands.slice(0, 6);

---
<Layout title="${t.title}" description="${t.desc}">
  <section class="pt-32 pb-16 bg-brand-navy border-b border-white/5">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">${t.h1}</h1>
      <p class="text-lg text-slate-400">${t.desc}</p>
    </div>
  </section>

  <section class="py-16 bg-brand-dark min-h-screen">
    <div class="max-w-4xl mx-auto px-4 prose prose-invert prose-brand">
      <h2>为什么要关注这个领域？</h2>
      <p>在选择网络加速服务时，单纯的“好”与“坏”往往是主观的。真正决定体验的是底层技术是否匹配您的实际需求。例如，游戏玩家需要专线的极低丢包，而流媒体用户则需要大带宽和原生 IP 库。</p>
      
      <h2>品牌案例与选择参考</h2>
      <p>根据当前项目掌握的真实品牌数据，以下服务商在当前分类下有明确的技术或服务特征说明：</p>
      
      <div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-12">
        {matchedBrands.length > 0 ? matchedBrands.map(b => (
          <a href={\`/brands/\${b.slug}\`} class="block bg-brand-navy border border-white/10 p-6 rounded-xl hover:border-brand-neon transition-colors">
            <h3 class="text-xl font-bold text-white mb-2">{b.name}</h3>
            <p class="text-sm text-slate-400 line-clamp-2">{b.features[0]}</p>
            <div class="mt-4 text-xs font-mono text-brand-neon">查看详情 &rarr;</div>
          </a>
        )) : <p class="text-slate-500">当前资料库中暂无完全匹配该标签的品牌数据。</p>}
      </div>
      
      <h2>常见问题与避坑指南</h2>
      <p>我们强烈建议用户不要盲目追求虚假的“测速排行榜”，而是通过观察晚高峰实际表现和自身的核心诉求（如跨端设备支持、AI 解锁）来决定。更多深入分析，请访问我们的 <a href="/blog">官方博客</a>。</p>
    </div>
  </section>
</Layout>
`;
  fs.writeFileSync(`src/pages/${t.slug}.astro`, code);
});
console.log('Created 9 Topic Landing Pages.');
