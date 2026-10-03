import fs from 'fs';
import path from 'path';

const blogDir = 'src/content/blog';
const files = fs.readdirSync(blogDir).filter(f => f.startsWith('kuaili-') || f.startsWith('feiv-'));

const replacements = [
  { search: /pubDate: "2026-10-04"/g, replace: 'pubDate: "2026-10-03"' },
  { search: /完美兼容/g, replace: '兼容' },
  { search: /实际测速/g, replace: '网络表现' },
  { search: /靠谱/g, replace: '稳定' },
  { search: /约 2–3 个工作日完成环境配置并交付使用/g, replace: '交付规则以当前官方页面为准' },
  { search: /通常需要 2–3 个工作日交付配置/g, replace: '交付规则以当前官方页面为准' },
  { search: /常见的通用客户端（如 Clash、Shadowrocket、v2rayN 等）均可用于.*?节点导入。/g, replace: '具体兼容性以当前官方页面为准。' },
  { search: /绝大多数主流的代理客户端（如 Clash、Shadowrocket 等）都可以完美兼容，无需额外安装复杂的特殊插件。/g, replace: '具体兼容性以当前官方页面为准。' },
  { search: /Clash 客户端可以直接.*?下载。/g, replace: '具体客户端导入方式请以官方页面为准。' },
  { search: /Shadowrocket \(小火箭\) 可通过.*?导入。/g, replace: '具体客户端导入方式请以官方页面为准。' },
  { search: /（如 Windows 的 v2rayN \/ Clash，iOS 的 Shadowrocket 等）/g, replace: '' },
  { search: /，包括Clash、Shadowrocket等常见工具的使用方法/g, replace: '' },
  { search: /涵盖Clash、Shadowrocket等工具的配置步骤/g, replace: '' },
  { search: /（如 Clash、Shadowrocket 等）/g, replace: '' }
];

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Blog updates applied.');
