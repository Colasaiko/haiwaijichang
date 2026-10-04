const fs = require('fs');
const file = 'src/content/brands/nanocloud.md';
let content = fs.readFileSync(file, 'utf8');

const oldUrl = 'https://edu.uodoo.bid/auth/register?code=P7gzTydW';
const newUrl = 'https://edge.shimo.men/auth/register?code=P7gzTydW';

if (content.includes(oldUrl)) {
  content = content.replace(oldUrl, newUrl);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Replaced NanoCloud AFF URL successfully.');
} else {
  console.log('Error: Could not find old URL in file.');
}
