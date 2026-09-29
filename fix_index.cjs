const fs = require('fs');

let c = fs.readFileSync('src/pages/index.astro', 'utf8');
c = c.replace(/const blogs = \(await getCollection\('blog'\)\)\.slice\(0, 3\);\n/, '');
c = c.replace(/import { getCollection } from 'astro:content';\nimport BrandCard from '\.\.\/components\/BrandCard\.astro';\nconst brandEntries = await getCollection\('brands'\);\nconst brands = brandEntries\.map\(e => \(\{ id: e\.id, \.\.\.e\.data \}\)\);/,
`import { getCollection } from 'astro:content';
import BrandCard from '../components/BrandCard.astro';
const brandEntries = await getCollection('brands');
const brands = brandEntries.map(e => ({ id: e.id, ...e.data }));
const blogs = (await getCollection('blog')).slice(0, 3);`);

fs.writeFileSync('src/pages/index.astro', c);
