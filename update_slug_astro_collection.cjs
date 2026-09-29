const fs = require('fs');

let content = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

// Update imports and getStaticPaths
content = content.replace(
  /import brands from '\.\.\/\.\.\/data\/brands\.json';[\s\S]*?export function getStaticPaths\(\) \{[\s\S]*?return brands\.map\(\(brand\) => \(\{[\s\S]*?params: \{ slug: brand\.slug \},[\s\S]*?props: \{ brand \},[\s\S]*?\}\)\);[\s\S]*?\}/,
  `import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const brandEntries = await getCollection('brands');
  return brandEntries.map(entry => ({
    params: { slug: entry.data.slug || entry.id },
    props: { entry },
  }));
}`
);

// Update props
content = content.replace(
  /const \{ brand \} = Astro\.props;/,
  `const { entry } = Astro.props;
const brand = entry.data;
const { Content } = await render(entry);`
);

// We need to replace the entire Content section in Details Content 
// Currently it relies on `brand.intro` or generic text, let's just use `<Content />`
content = content.replace(
  /\{brand\.intro \? \([\s\S]*?<div class="space-y-4" set:html=\{brand\.intro\} \/>[\s\S]*?\) : \([\s\S]*?<p>[\s\S]*?根据当前收录的官方品牌资料[\s\S]*?<\/p>[\s\S]*?\)\}/,
  `<div class="prose prose-invert prose-brand max-w-none brand-content-rendered"><Content /></div>`
);

// Also replace the purchase button link to use brand.purchase.url if available, else brand.aff
content = content.replace(/\{brand\.aff\}/g, '{brand.purchase?.url || brand.aff}');
content = content.replace(/brand\.aff \?/g, '(brand.purchase?.url || brand.aff) ?');
content = content.replace(/brand\.aff \|\| "#"/g, 'brand.purchase?.url || brand.aff || "#"');

fs.writeFileSync('src/pages/brands/[slug].astro', content);
console.log('Updated [slug].astro to use Content Collections');
