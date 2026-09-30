const fs = require('fs');

let c = fs.readFileSync('src/content/pages/status.md', 'utf8');

c = c.replace(/incidents:[\s\S]*?scheduled:/, "incidents: []\nscheduled:");
c = c.replace(/scheduled:[\s\S]*?---/, "scheduled: []\n---");

fs.writeFileSync('src/content/pages/status.md', c);
console.log('Fixed status.md');
