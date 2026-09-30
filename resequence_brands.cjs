const fs = require('fs');
const path = require('path');

const brandsDir = 'src/content/brands';
const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.md'));

const fixedOrders = {
  'weifeng.md': 1,
  'feimao.md': 2,
  'firefly.md': 3,
  'wuyou.md': 4,
  'kuajie.md': 5,
  'lingmao.md': 6,
  'shanyue.md': 7,
  'baoyun.md': 11,
  'jiuyun.md': 12,
  'shenxing.md': 13
};

let others = [];

files.forEach(file => {
  if (!fixedOrders[file]) {
    const content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
    const match = content.match(/^order:\s*(\d+)/m);
    let order = match ? parseInt(match[1]) : 999;
    others.push({ file, content, currentOrder: order });
  }
});

// Sort others by their current order
others.sort((a, b) => a.currentOrder - b.currentOrder);

const usedSlots = new Set(Object.values(fixedOrders));

let nextSlot = 8;
const otherAssignments = {};

others.forEach(o => {
  while (usedSlots.has(nextSlot)) {
    nextSlot++;
  }
  otherAssignments[o.file] = nextSlot;
  usedSlots.add(nextSlot);
});

const allAssignments = { ...fixedOrders, ...otherAssignments };

Object.entries(allAssignments).forEach(([file, newOrder]) => {
  let content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
  if (content.match(/^order:\s*\d+/m)) {
    content = content.replace(/^order:\s*\d+/m, `order: ${newOrder}`);
  } else {
    content = content.replace(/name:\s*".*?"\n/, `$&order: ${newOrder}\n`);
  }
  fs.writeFileSync(path.join(brandsDir, file), content);
  console.log(`Updated ${file} to order: ${newOrder}`);
});
