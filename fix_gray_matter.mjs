import fs from 'fs';
import matter from 'gray-matter';

const content = fs.readFileSync('src/content/brands/edge.md', 'utf8');
const parsed = matter(content);

if (parsed.data.temporaryCoupons) {
  parsed.data.temporaryCoupons.forEach(tc => {
    delete tc.overrideStandard;
  });
}

const newFileContent = matter.stringify(parsed.content, parsed.data);
fs.writeFileSync('src/content/brands/edge.md', newFileContent);
