const fs = require('fs');
let script = fs.readFileSync('update_tizi.cjs', 'utf8');
script = script.replace(/expiry: "2026-10-10T23:59:59Z"/g, 'manualActive: true, expiresAt: "2026-10-10T23:59:59Z"');
fs.writeFileSync('update_tizi.cjs', script);
