const fs = require('fs');

// Patch QuickFacts.astro to include streamingSupport and aiSupport
const qfFile = 'src/components/charts/QuickFacts.astro';
let qfCode = fs.readFileSync(qfFile, 'utf8');
if (!qfCode.includes('brand.streamingSupport')) {
  qfCode = qfCode.replace(
    /if \(brand\.customerSupport\)[^\n]+/,
    match => match + "\nif (brand.streamingSupport) facts.push({ label: '流媒体解锁', value: Array.isArray(brand.streamingSupport) ? brand.streamingSupport.join(' / ') : brand.streamingSupport });\nif (brand.aiSupport) facts.push({ label: 'AI 解锁', value: Array.isArray(brand.aiSupport) ? brand.aiSupport.join(' / ') : brand.aiSupport });"
  );
  fs.writeFileSync(qfFile, qfCode, 'utf8');
  console.log('Patched QuickFacts.astro');
}

// Patch [slug].astro to include telegram button
const slugFile = 'src/pages/brands/[slug].astro';
let slugCode = fs.readFileSync(slugFile, 'utf8');

if (!slugCode.includes('brand.telegram')) {
  const telegramButton = `
          {(brand.telegram) && (
            <a href={brand.telegram} target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex items-center justify-center px-6 py-3 bg-[#0088cc] text-white font-bold text-sm rounded-sm hover:bg-[#0077b5] transition-all tracking-widest shadow-[0_0_15px_rgba(0,136,204,0.3)] w-full md:w-auto">
              <svg class="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.667 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Telegram 频道
            </a>
          )}
`;
  
  slugCode = slugCode.replace(
    /(<span class="inline-flex[^>]+>\s*购买入口待补充\s*<\/span>\s*)}/m,
    match => match + telegramButton
  );
  fs.writeFileSync(slugFile, slugCode, 'utf8');
  console.log('Patched [slug].astro');
}
