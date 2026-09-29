const fs = require('fs');

const guidesMd = `---
title: "使用指南与教程 | 海外机场"
description: "全面、易懂的跨境网络使用教程，包含全平台客户端配置指南、节点连通性排查、流媒体解锁技巧以及进阶网络分流玩法。"
keywords: "机场教程, 梯子教程, 科学上网教程, Clash配置, Shadowrocket使用, 翻墙指南"
h1: "Guides & Tutorials"
heroSubtitle: "你的跨境网络领航手册"
searchPlaceholder: "搜索教程... (例如：Clash, iOS, Netflix)"
bottomCta:
  title: "没找到你需要的教程？"
  desc: "欢迎向我们反馈，我们会尽快补充相关内容。或者，你可以先在常见问题(FAQ)中寻找答案。"
  buttonText: "查看常见问题"
  buttonLink: "/faq"
categories:
  - id: "getting-started"
    name: "新手入门"
    desc: "从零开始，快速理解跨境网络的基础概念与术语。"
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  - id: "clash"
    name: "Clash 系列"
    desc: "彻底玩转最受欢迎的代理核心及其分流规则。"
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
---
`;

fs.writeFileSync('src/content/pages/guides.md', guidesMd);

const guidesAstro = `---
import Layout from '../layouts/Layout.astro';
import { getEntry, getCollection } from 'astro:content';

const page = await getEntry('pages', 'guides');
const { title, description, keywords, h1, heroSubtitle, searchPlaceholder, bottomCta, categories } = page.data;
const allGuides = await getCollection('guides');
---

<Layout 
  title={title}
  description={description}
  keywords={keywords}
>
  <section class="pt-32 pb-16 bg-brand-navy border-b border-white/5 relative overflow-hidden">
    <div class="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
      <div class="w-[800px] h-[800px] border-[40px] border-brand-neon rounded-full blur-[120px]"></div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-10">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white uppercase">
          {h1}
        </h1>
        <p class="text-lg text-slate-400">
          {heroSubtitle}
        </p>
      </div>

      <!-- Search -->
      <div class="max-w-2xl mx-auto relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-brand-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          class="block w-full pl-12 pr-4 py-4 bg-brand-dark/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-neon/50 focus:border-brand-neon/50 transition-all shadow-[0_0_15px_rgba(56,189,248,0.1)] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
        />
        <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
          <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 border border-white/10 rounded text-xs font-mono text-slate-500">⌘K</kbd>
        </div>
      </div>
    </div>
  </section>

  <!-- Content -->
  <section class="py-16 bg-brand-dark min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {categories.map((category) => {
        const categoryGuides = allGuides.filter(g => g.data.category === category.id || (!g.data.category && category.id === 'clash')); // Just map clash-what-is to clash for now if missing
        if(categoryGuides.length === 0) return null; // DO NOT RENDER EMPTY CATEGORIES
        return (
        <div>
          <div class="flex items-end justify-between mb-8 pb-4 border-b border-white/5">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-lg bg-brand-navy border border-brand-neon/20 flex items-center justify-center mr-4">
                <svg class="w-5 h-5 text-brand-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={category.icon} /></svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-white">{category.name}</h2>
                <p class="text-sm text-slate-400 mt-1">{category.desc}</p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryGuides.map((guide) => (
              <a href={"/guides/" + guide.slug} class="group bg-brand-navy border border-white/5 rounded-xl p-6 hover:border-brand-neon/30 transition-all hover:-translate-y-1 block">
                <h3 class="text-base font-bold text-slate-300 group-hover:text-brand-neon transition-colors mb-2 line-clamp-2">{guide.data.title}</h3>
                <p class="text-sm text-slate-500 line-clamp-2">{guide.data.description}</p>
                <div class="mt-4 flex items-center text-xs font-mono text-brand-neon/70 group-hover:text-brand-neon">
                  <span>阅读教程</span>
                  <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      )})}
    </div>
  </section>

  <!-- CTA -->
  <section class="py-16 bg-brand-navy relative overflow-hidden border-t border-white/5">
    <div class="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h2 class="text-2xl font-bold text-white mb-4">{bottomCta.title}</h2>
      <p class="text-slate-400 mb-8">{bottomCta.desc}</p>
      <a href={bottomCta.buttonLink} class="inline-flex items-center px-8 py-3 bg-brand-neon/10 text-brand-neon border border-brand-neon/30 rounded-full font-bold hover:bg-brand-neon hover:text-brand-dark transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)]">
        {bottomCta.buttonText}
      </a>
    </div>
  </section>
</Layout>
`;

fs.writeFileSync('src/pages/guides.astro', guidesAstro);

const guideSlugAstro = `---
import Layout from '../../layouts/Layout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const guideEntries = await getCollection('guides');
  return guideEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<Layout title={entry.data.title} description={entry.data.description} keywords={entry.data.keywords}>
  <section class="pt-32 pb-16 bg-brand-navy border-b border-white/5 relative overflow-hidden">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <h1 class="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">{entry.data.title}</h1>
      <p class="text-lg text-slate-400">{entry.data.description}</p>
    </div>
  </section>
  <section class="py-16 bg-brand-dark">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert prose-brand max-w-none brand-content-rendered">
      <Content />
    </div>
  </section>
</Layout>
`;

fs.mkdirSync('src/pages/guides', { recursive: true });
fs.writeFileSync('src/pages/guides/[slug].astro', guideSlugAstro);
console.log('Fixed guides.');
