import fs from 'fs';
import matter from 'gray-matter';

const content = fs.readFileSync('src/content/brands/edge.md', 'utf8');
const parsed = matter(content);

if (parsed.data.visualData && parsed.data.visualData.resetPackages) {
  parsed.data.resetPackages = parsed.data.visualData.resetPackages;
  delete parsed.data.visualData.resetPackages;
}

const newFileContent = matter.stringify(parsed.content, parsed.data);
fs.writeFileSync('src/content/brands/edge.md', newFileContent);
