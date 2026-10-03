const fs = require('fs');
let content = fs.readFileSync('src/content/brands/edge.md', 'utf8');

// Replace both forms to be perfectly safe
content = content.replace(/\\r\\n\\s*overrideStandard: true/g, '');
content = content.replace(/\\n\\s*overrideStandard: true/g, '');

fs.writeFileSync('src/content/brands/edge.md', content);
