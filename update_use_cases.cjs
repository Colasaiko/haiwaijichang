const fs = require('fs');
let content = fs.readFileSync('src/pages/use-cases.astro', 'utf8');
if (!content.includes('相关推荐品牌')) {
  // Add AI brand block
  content = content.replace(
    '1. AI Tools Access',
    '1. AI Tools Access (ChatGPT, Midjourney)'
  );
  content = content.replace(
    '</p>\n              <a href="/help/ai-tools-access"',
    '</p>\n              <div class="mt-4 mb-6 p-4 bg-brand-navy border border-brand-neon/20 rounded-lg">\n                <h4 class="text-sm font-bold text-brand-neon mb-3">相关推荐品牌 (AI Ready)</h4>\n                <div class="flex flex-wrap gap-2">\n                  <a href="/brands/kuajie" class="text-xs text-white hover:text-brand-neon bg-white/5 border border-white/10 px-3 py-1.5 rounded transition-colors">跨界云</a>\n                  <a href="/brands/firefly" class="text-xs text-white hover:text-brand-neon bg-white/5 border border-white/10 px-3 py-1.5 rounded transition-colors">萤火虫</a>\n                  <a href="/brands/lingmao" class="text-xs text-white hover:text-brand-neon bg-white/5 border border-white/10 px-3 py-1.5 rounded transition-colors">灵猫</a>\n                </div>\n              </div>\n              <a href="/help/ai-tools-access"'
  );
  
  // Add Streaming brand block
  content = content.replace(
    '</p>\n              <a href="/help/streaming-region-locked"',
    '</p>\n              <div class="mt-4 mb-6 p-4 bg-brand-navy border border-brand-neon/20 rounded-lg">\n                <h4 class="text-sm font-bold text-brand-neon mb-3">流媒体解锁推荐品牌</h4>\n                <div class="flex flex-wrap gap-2">\n                  <a href="/brands/feimao" class="text-xs text-white hover:text-brand-neon bg-white/5 border border-white/10 px-3 py-1.5 rounded transition-colors">飞猫云</a>\n                  <a href="/brands/kuajie" class="text-xs text-white hover:text-brand-neon bg-white/5 border border-white/10 px-3 py-1.5 rounded transition-colors">跨界云</a>\n                </div>\n              </div>\n              <a href="/help/streaming-region-locked"'
  );

  fs.writeFileSync('src/pages/use-cases.astro', content);
  console.log('Injected Use Cases');
}
