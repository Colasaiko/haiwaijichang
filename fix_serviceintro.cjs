const fs = require('fs');

let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

c = c.replace(/<div class="prose prose-invert prose-brand max-w-none">\s*<h2 class="text-2xl font-bold text-white mb-6 pb-4 border-b border-white\/10 flex items-center mt-12">\s*<span class="w-1.5 h-6 bg-brand-neon mr-3 rounded-sm"><\/span>\s*关于 \{brand\.name\} 的线路与服务信息\s*<\/h2>\s*<div class="prose prose-invert prose-brand max-w-none brand-content-rendered"><Content \/><\/div>\s*<h3>使用建议与支持<\/h3>\s*<p>\s*如果你是新手，建议先参考我们的 <a href="\/blog\/what-is-airport-subscription" class="text-brand-neon hover:underline">机场订阅是什么？新手指南<\/a>。购买 \{brand\.name\} 的服务后，将获取到的订阅链接导入本地客户端即可开始使用。如遇连接异常，请优先参考我们的<a href="\/help">帮助中心故障排查<\/a>。\s*<\/p>\s*<\/div>/,
`        {brand.serviceIntro && (
          <div class="prose prose-invert prose-brand max-w-none">
            <h2 class="text-2xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center mt-12">
              <span class="w-1.5 h-6 bg-brand-neon mr-3 rounded-sm"></span>
              关于 {brand.name} 的线路与服务信息
            </h2>
            {Array.isArray(brand.serviceIntro) ? (
              brand.serviceIntro.map((para) => <p>{para}</p>)
            ) : (
              <p>{brand.serviceIntro}</p>
            )}
          </div>
        )}

        <div class="prose prose-invert prose-brand max-w-none brand-content-rendered">
          <Content />
          
          <h3>使用建议与支持</h3>
          <p>
            如果你是新手，建议先参考我们的 <a href="/blog/what-is-airport-subscription" class="text-brand-neon hover:underline">机场订阅是什么？新手指南</a>。购买 {brand.name} 的服务后，将获取到的订阅链接导入本地客户端即可开始使用。如遇连接异常，请优先参考我们的<a href="/help">帮助中心故障排查</a>。
          </p>
        </div>`);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Fixed serviceIntro structure with Regex');
