const fs = require('fs');

let content = fs.readFileSync('src/components/BlogBrandCard.astro', 'utf8');
content = content.replace(/import brands from '\.\.\/data\/brands\.json';/, 
`import { getCollection } from 'astro:content';
const brandEntries = await getCollection('brands');
const brands = brandEntries.map(e => ({ id: e.id, ...e.data }));`);

fs.writeFileSync('src/components/BlogBrandCard.astro', content);
console.log('Updated BlogBrandCard');
