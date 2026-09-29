const fs = require('fs');
const path = require('path');

const brands = JSON.parse(fs.readFileSync('src/data/brands.json', 'utf8'));
const brandsDir = path.join('src', 'content', 'brands');

if (!fs.existsSync(brandsDir)) {
  fs.mkdirSync(brandsDir, { recursive: true });
}

brands.forEach(b => {
  if (b.slug === 'weifeng') return; // weifeng is already manually handled

  const mdPath = path.join(brandsDir, `${b.slug}.md`);

  const features = b.features || [];
  const pricing = b.pricing || [];
  
  // Try to extract useful keywords or tags from generic json
  let lineType = [];
  if (features.some(f => f.includes('IPLC') || f.includes('IEPL') || f.includes('专线'))) {
    lineType.push('专线');
  }

  const frontmatter = {
    name: b.name,
    slug: b.slug,
    title: `${b.name} 怎么样？2026 套餐价格与测评 | 海外机场`,
    description: `为您整理 ${b.name} 机场最新的套餐价格、优惠码以及线路特色。`,
    featured: ["微风网络", "飞猫云", "萤火虫 (FireFly)", "无忧链接", "跨界云", "灵猫", "闪跃", "九云", "宝云", "神行加速"].includes(b.name),
    coupon: b.discount ? { discount: b.discount } : {},
    lineType: lineType,
    pricing: pricing,
    purchase: {
      label: "快速购买",
      url: b.aff || "#",
      cloaked: true
    }
  };

  // Build YAML
  let yaml = '---\n';
  yaml += `name: "${frontmatter.name}"\n`;
  yaml += `slug: "${frontmatter.slug}"\n`;
  yaml += `title: "${frontmatter.title}"\n`;
  yaml += `description: "${frontmatter.description}"\n`;
  yaml += `featured: ${frontmatter.featured}\n`;

  if (frontmatter.purchase) {
    yaml += `purchase:\n  label: "${frontmatter.purchase.label}"\n  url: "${frontmatter.purchase.url}"\n  cloaked: ${frontmatter.purchase.cloaked}\n`;
  }
  
  if (b.discount) {
    yaml += `coupon:\n  discount: "${b.discount}"\n`;
  }

  if (b.established) yaml += `established: "${b.established}"\n`;
  if (b.telegram) yaml += `telegram: "${b.telegram}"\n`;
  if (b.payment) yaml += `payment: "${b.payment}"\n`;
  if (b.protocols) yaml += `protocols: "${b.protocols}"\n`;
  if (b.nodes) yaml += `nodes: "${b.nodes}"\n`;

  if (frontmatter.pricing && frontmatter.pricing.length > 0) {
    yaml += 'pricing:\n';
    frontmatter.pricing.forEach(p => {
      yaml += `  - name: "${p.name || ''}"\n`;
      yaml += `    traffic: "${p.traffic || ''}"\n`;
      yaml += `    price: "${p.price || ''}"\n`;
    });
  }

  yaml += '---\n\n';

  let body = b.intro ? b.intro : `根据当前收录的官方品牌资料，**${b.name}** 提供了适合不同需求用户的网络加速方案。请注意，目前站内对该品牌的独立测试数据仍在完善中，实际体验可能受限于您所在地区的网络环境和运营商（如电信、联通、移动）的路由差异。\n`;
  
  if (features.length > 0) {
    body += `\n### 已知服务特性\n\n`;
    features.forEach(f => {
      body += `- ${f}\n`;
    });
  }

  fs.writeFileSync(mdPath, yaml + body);
});

console.log('Successfully migrated brands to Markdown files.');
