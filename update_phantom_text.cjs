const fs = require('fs');
const matter = require('gray-matter');

const file = 'src/content/brands/phantom.md';
let raw = fs.readFileSync(file, 'utf8');
let parsed = matter(raw);

// Add telegram
parsed.data.telegram = "https://t.me/+4lJv0rPdfJVjNzQ1";

// Update coupon description
const oldText = "Phantom 暂无公开优惠码，套餐本身已经处于极致性价比状态（低至 1 元/月），具体变动请以官方控制台公告为准。";
const newText = "Phantom 暂无公开优惠码，套餐本身已经处于极致性价比状态（低至 1 元/月）。可加入官方 Telegram 频道获取最新公告与活动信息。";

if (parsed.content.includes(oldText)) {
  parsed.content = parsed.content.replace(oldText, newText);
  fs.writeFileSync(file, matter.stringify(parsed.content, parsed.data), 'utf8');
  console.log("Successfully updated phantom.md");
} else {
  console.error("Could not find the old text to replace! Here is what we have:");
  console.log(parsed.content);
  process.exit(1);
}
