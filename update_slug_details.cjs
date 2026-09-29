const fs = require('fs');

let astro = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

// Replace the generic paragraph with conditional intro
astro = astro.replace(
  /<p>\s*根据当前收录的官方品牌资料[\s\S]*?<\/p>/,
  `{brand.intro ? (
            <div class="space-y-4" set:html={brand.intro} />
          ) : (
            <p>
              根据当前收录的官方品牌资料，<strong>{brand.name}</strong> 提供了适合不同需求用户的网络加速方案。请注意，目前站内对该品牌的独立测试数据仍在完善中，实际体验可能受限于您所在地区的网络环境和运营商（如电信、联通、移动）的路由差异。
            </p>
          )}`
);

// Add the new structured list items
astro = astro.replace(
  /\{hasIPLC \? <li><strong>线路类型：<\/strong>[\s\S]*?<\/li>\}/,
  `{hasIPLC ? <li><strong>线路类型：</strong> 资料显示支持 IPLC 或其他专线网络，理论上在晚高峰时能提供较低的物理延迟。</li> : <li><strong>线路类型：</strong> 暂无明确的专线网络标记，通常可能是直连或中转线路，建议结合个人网络测试。</li>}
            {brand.protocols && <li><strong>支持协议：</strong> {brand.protocols}</li>}
            {brand.nodes && <li><strong>节点覆盖：</strong> {brand.nodes}</li>}
            {brand.established && <li><strong>品牌背景：</strong> {brand.established}</li>}
            {brand.payment && <li><strong>付款方式：</strong> {brand.payment}</li>}
            {brand.telegram && <li><strong>官方频道：</strong> <a href={brand.telegram} target="_blank" class="text-brand-neon hover:underline break-all">{brand.telegram}</a></li>}`
);

fs.writeFileSync('src/pages/brands/[slug].astro', astro);
console.log('Updated [slug].astro to support detailed brand info');
