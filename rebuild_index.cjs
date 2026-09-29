const fs = require('fs');

const originalIndex = fs.readFileSync('src/pages/index.astro', 'utf8');
const lines = originalIndex.split('\n');

// Find the line index to insert import
const frontmatterEnd = lines.indexOf('---', 1);
lines.splice(frontmatterEnd, 0, "import BrandCard from '../components/BrandCard.astro';");
lines.splice(frontmatterEnd, 0, "import { getCollection } from 'astro:content';");
lines.splice(frontmatterEnd, 0, "const blogs = (await getCollection('blog')).slice(0, 3);");

// Find the end of SEO block (<!-- 2. Global Network Departure Board --> is around line 147)
const boardStartIdx = lines.findIndex(l => l.includes('<!-- 2. Global Network Departure Board -->'));

const topPart = lines.slice(0, boardStartIdx).join('\n');

const newContent = `
  <!-- FAST PICK -->
  <section class="py-20 bg-brand-dark border-y border-white/5 relative z-10" id="fast-pick">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="mb-12">
        <h2 class="text-brand-accent font-mono tracking-[0.3em] text-sm mb-2">FAST PICK</h2>
        <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">不知道选哪个？按需求直接选。</h3>
        <p class="text-slate-400">不用研究几十个参数，根据你的主要用途快速找到合适品牌。</p>
      </div>

      <div class="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-16">
        <button class="fast-pick-btn px-6 py-3 bg-brand-navy border border-white/10 text-white rounded-full font-bold hover:border-brand-neon hover:text-brand-neon transition-colors" data-filter="all">所有品牌</button>
        <button class="fast-pick-btn px-6 py-3 bg-brand-navy border border-white/10 text-white rounded-full font-bold hover:border-brand-neon hover:text-brand-neon transition-colors" data-filter="稳定">稳定优先</button>
        <button class="fast-pick-btn px-6 py-3 bg-brand-navy border border-white/10 text-white rounded-full font-bold hover:border-brand-neon hover:text-brand-neon transition-colors" data-filter="价格">价格优先</button>
        <button class="fast-pick-btn px-6 py-3 bg-brand-navy border border-white/10 text-white rounded-full font-bold hover:border-brand-neon hover:text-brand-neon transition-colors" data-filter="专线">IPLC / IEPL 专线</button>
        <button class="fast-pick-btn px-6 py-3 bg-brand-navy border border-white/10 text-white rounded-full font-bold hover:border-brand-neon hover:text-brand-neon transition-colors" data-filter="AI">ChatGPT / AI</button>
        <button class="fast-pick-btn px-6 py-3 bg-brand-navy border border-white/10 text-white rounded-full font-bold hover:border-brand-neon hover:text-brand-neon transition-colors" data-filter="Streaming">Netflix / 流媒体</button>
        <button class="fast-pick-btn px-6 py-3 bg-brand-navy border border-white/10 text-white rounded-full font-bold hover:border-brand-neon hover:text-brand-neon transition-colors" data-filter="多设备">多设备使用</button>
      </div>
    </div>
  </section>

  <!-- FEATURED DEPARTURES -->
  <section class="py-20 bg-brand-navy relative" id="featured">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12">
        <h2 class="text-brand-accent font-mono tracking-[0.3em] text-sm mb-2">FEATURED DEPARTURES</h2>
        <h3 class="text-3xl font-bold text-white">精选品牌</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="featured-grid">
        {brands.filter(b => ["微风网络", "飞猫云", "萤火虫 (FireFly)", "无忧链接", "跨界云", "灵猫", "闪跃"].includes(b.name)).map(b => (
          <BrandCard brand={b} featured={true} />
        ))}
      </div>
    </div>
  </section>

  <!-- MORE BRANDS -->
  <section class="py-20 bg-brand-dark border-y border-white/5 relative" id="more">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12">
        <h2 class="text-brand-accent font-mono tracking-[0.3em] text-sm mb-2">MORE BRANDS</h2>
        <h3 class="text-3xl font-bold text-white">更多品牌</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="more-grid">
        {brands.filter(b => !["微风网络", "飞猫云", "萤火虫 (FireFly)", "无忧链接", "跨界云", "灵猫", "闪跃"].includes(b.name)).map(b => (
          <BrandCard brand={b} featured={false} />
        ))}
      </div>
      
      <div id="no-results" class="hidden text-center py-20">
        <p class="text-slate-400 text-lg">暂无完整匹配该标签的资料，请尝试其他分类。</p>
      </div>
    </div>
  </section>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const btns = document.querySelectorAll('.fast-pick-btn');
      const cards = document.querySelectorAll('[data-brand-card]');
      const noResults = document.getElementById('no-results');
      
      btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          // Update active state
          btns.forEach(b => {
            b.classList.remove('bg-brand-neon', 'text-brand-dark', 'border-brand-neon');
            b.classList.add('bg-brand-navy', 'text-white', 'border-white/10');
          });
          const target = e.target;
          target.classList.remove('bg-brand-navy', 'text-white', 'border-white/10');
          target.classList.add('bg-brand-neon', 'text-brand-dark', 'border-brand-neon');
          
          const filter = target.getAttribute('data-filter');
          let visibleCount = 0;
          
          cards.forEach(card => {
            const tags = card.getAttribute('data-tags') || '';
            const isFeatured = card.querySelector('.bg-brand-accent'); // Check if it has featured badge
            
            if (filter === 'all') {
              card.style.display = 'flex';
              visibleCount++;
              return;
            }
            
            if (filter === '稳定' && tags.includes('专线')) { card.style.display = 'flex'; visibleCount++; return; }
            if (filter === '价格') { card.style.display = 'none'; return; /* Prices not easily filtered by tag */ }
            if (filter === '专线' && tags.includes('专线')) { card.style.display = 'flex'; visibleCount++; return; }
            if (filter === 'AI' && tags.includes('AI')) { card.style.display = 'flex'; visibleCount++; return; }
            if (filter === 'Streaming' && tags.includes('Streaming')) { card.style.display = 'flex'; visibleCount++; return; }
            if (filter === '多设备' && tags.includes('多设备')) { card.style.display = 'flex'; visibleCount++; return; }
            
            card.style.display = 'none';
          });
          
          if (filter === '价格' || visibleCount === 0) {
            if(noResults) noResults.style.display = 'block';
            if(filter === '价格' && noResults) noResults.innerHTML = '<p class="text-slate-400 text-lg">暂无完整价格资料结构进行筛选，请进入品牌中心查看详情。</p>';
            else if (noResults) noResults.innerHTML = '<p class="text-slate-400 text-lg">暂无完整匹配该标签的资料，请尝试其他分类。</p>';
          } else {
            if(noResults) noResults.style.display = 'none';
          }
        });
      });
    });
  </script>

  <!-- Use Cases -->
  <section class="py-20 bg-brand-navy relative border-y border-white/5">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-brand-accent font-mono tracking-widest text-sm mb-2">SCENARIOS</h2>
        <h3 class="text-3xl font-bold text-white">常用网络环境与场景支持</h3>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        <a href="/use-cases" class="block p-8 bg-brand-dark rounded-xl border border-white/5 hover:border-brand-neon/50 transition-colors group">
          <h4 class="text-xl font-bold text-white mb-3 group-hover:text-brand-neon">AI 工具与开发</h4>
          <p class="text-sm text-slate-400">稳定解锁 ChatGPT, Claude, Midjourney，告别 IP 纯净度低导致的封号风控。</p>
        </a>
        <a href="/use-cases" class="block p-8 bg-brand-dark rounded-xl border border-white/5 hover:border-brand-neon/50 transition-colors group">
          <h4 class="text-xl font-bold text-white mb-3 group-hover:text-brand-neon">全球流媒体</h4>
          <p class="text-sm text-slate-400">支持 Netflix, Disney+, Hulu 原生 IP，享受 4K 高清且无需缓冲的观影体验。</p>
        </a>
        <a href="/use-cases" class="block p-8 bg-brand-dark rounded-xl border border-white/5 hover:border-brand-neon/50 transition-colors group">
          <h4 class="text-xl font-bold text-white mb-3 group-hover:text-brand-neon">跨平台设备</h4>
          <p class="text-sm text-slate-400">兼容 Windows, macOS, iOS, Android, 甚至软路由设备，一键导入节点，全设备在线。</p>
        </a>
      </div>
    </div>
  </section>

  <!-- Blog -->
  <section class="py-20 bg-brand-dark relative">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-end mb-12">
        <div>
          <h2 class="text-brand-accent font-mono tracking-widest text-sm mb-2">OFFICIAL BLOG</h2>
          <h3 class="text-3xl font-bold text-white">最新深度评测与指南</h3>
        </div>
        <a href="/blog" class="hidden md:inline-flex text-brand-neon hover:text-white transition-colors text-sm font-bold items-center">
          查看全部文章 <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </a>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map(post => (
          <a href={\`/blog/\${post.id}\`} class="block group bg-brand-navy border border-white/5 rounded-xl p-6 hover:border-brand-neon/30 transition-all">
            <div class="text-xs font-mono text-brand-accent mb-3">{post.data.date || 'LATEST'}</div>
            <h4 class="text-lg font-bold text-white mb-2 group-hover:text-brand-neon line-clamp-2">{post.data.title}</h4>
            <p class="text-sm text-slate-400 line-clamp-3">{post.data.description}</p>
          </a>
        ))}
      </div>
      <div class="mt-8 text-center md:hidden">
        <a href="/blog" class="inline-flex text-brand-neon hover:text-white transition-colors text-sm font-bold items-center">
          查看全部文章 <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </a>
      </div>
    </div>
  </section>
</Layout>
`;

fs.writeFileSync('src/pages/index.astro', topPart + '\n' + newContent);
console.log('Successfully rebuilt index.astro');
