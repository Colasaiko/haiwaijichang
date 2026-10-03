const fs = require('fs');
let s = fs.readFileSync('generate_visual_data.cjs', 'utf8');
s = s.replace('matter.stringify(data, parsed.content)', "matter.stringify(parsed.content || '', data)");
fs.writeFileSync('generate_visual_data.cjs', s);
