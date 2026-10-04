const fs = require('fs');
const matter = require('gray-matter');

const file = 'src/content/brands/nanocloud.md';
let raw = fs.readFileSync(file, 'utf8');

const oldUrl = 'https://edge.shimo.men/auth/register?code=P7gzTydW';
const newUrl = '/go/https://edge.shimo.men/auth/register?code=P7gzTydW';

if (raw.includes(oldUrl)) {
  raw = raw.replace(oldUrl, newUrl);
  fs.writeFileSync(file, raw, 'utf8');
  console.log('Successfully added /go/ prefix to nanocloud url');
} else {
  console.error('Could not find the old url');
}
