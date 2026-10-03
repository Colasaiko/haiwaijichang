const fs = require('fs');
let c = fs.readFileSync('scripts/check-coupon-consistency.mjs', 'utf8');

const targetStr = `  if (!pricePass) {
    console.error('ERROR: YIFAN PRICE CHECK failed');
    yfErrors++; errors++;
  }`;
const replStr = `  if (!pricePass) {
    console.error('ERROR: YIFAN PRICE CHECK failed');
    yfErrors++; errors++;
  }
  if (yfErrors === 0) console.log('YIFAN COUPON CONSISTENCY: PASS');`;

c = c.replace(targetStr, replStr);

// Move YIFAN block before the final logs
const yfStart = c.indexOf('// --- YIFAN Consistency Test ---');
let beforeYf = c.substring(0, yfStart);
let yfBlock = c.substring(yfStart);

// Remove the final logs from beforeYf
beforeYf = beforeYf.replace("console.log('COUPON CONSISTENCY: PASS');", "");
beforeYf = beforeYf.replace("console.log('CONTRADICTIONS: ' + errors);", "");

// Remove the process.exit from yfBlock if present
yfBlock = yfBlock.replace("if (errors > 0) process.exit(1);", "");

const finalLogs = `
console.log('COUPON CONSISTENCY: PASS');
console.log('CONTRADICTIONS: ' + errors);
if (errors > 0) process.exit(1);
`;

const finalFile = beforeYf + yfBlock + finalLogs;
fs.writeFileSync('scripts/check-coupon-consistency.mjs', finalFile);
