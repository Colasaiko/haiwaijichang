const fs = require('fs');
let c = fs.readFileSync('src/content/blog/cheap-vs-iplc-airport.mdx', 'utf8');

// The file starts with frontmatter:
// ---
// title: ...
// ---
let parts = c.split('---');
if (parts.length >= 3) {
  parts[2] = '\nimport BlogBrandCard from "../../components/BlogBrandCard.astro";\n' + parts[2];
}
c = parts.join('---');

// Remove the old markdown list links to brands and inject our components
c = c.replace(/- \*\*\[.*?\]\(.*?\)\*\*: .*?\n/g, '');
c += '\n\n<BlogBrandCard slug="weifeng" />\n<BlogBrandCard slug="kuajie" />\n';

fs.writeFileSync('src/content/blog/cheap-vs-iplc-airport.mdx', c);
