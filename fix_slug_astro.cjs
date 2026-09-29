const fs = require('fs');

let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

c = c.replace(/import Layout from '\.\.\/\.\.\/layouts\/Layout\.astro';\nimport fs from 'node:fs';\nimport path from 'node:path';/,
`import Layout from '../../layouts/Layout.astro';
import { getCollection, render } from 'astro:content';`);

c = c.replace(/export async function getStaticPaths\(\) \{[\s\S]*?return brands\.map\(\(brand\) => \{[\s\S]*?params: \{ slug: brand\.slug \},[\s\S]*?props: \{ brand, allBrands: brands \}[\s\S]*?\}\);\n\}/,
`export async function getStaticPaths() {
  const brandEntries = await getCollection('brands');
  return brandEntries.map(entry => ({
    params: { slug: entry.data.slug || entry.id },
    props: { entry, allEntries: brandEntries },
  }));
}`);

c = c.replace(/const \{ brand, allBrands \} = Astro\.props;/, 
`const { entry, allEntries } = Astro.props;
const brand = entry.data;
const allBrands = allEntries.map(e => ({ id: e.id, ...e.data }));
const { Content } = await render(entry);`);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
