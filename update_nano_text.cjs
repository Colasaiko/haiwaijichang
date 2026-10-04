const fs = require('fs');
const matter = require('gray-matter');

const file = 'src/content/brands/nanocloud.md';
let raw = fs.readFileSync(file, 'utf8');
let parsed = matter(raw);

// Add telegram
parsed.data.telegram = "https://t.me/+ozCTB7VsmvFkMTNl";

// Replace coupon text
const oldText = "NanoCloud 当前暂无通用的公开优惠码，请加入官方 TG 群组获取最新内部专属优惠及活动信息。";
const newText = "NanoCloud 当前暂无公开通用优惠码，可加入官方 Telegram 频道获取内部优惠与活动信息。";

if (parsed.content.includes(oldText)) {
  parsed.content = parsed.content.replace(oldText, newText);
  fs.writeFileSync(file, matter.stringify(parsed.content, parsed.data), 'utf8');
  console.log("Successfully updated nanocloud.md");
} else {
  console.error("Could not find the old text to replace!");
  process.exit(1);
}
