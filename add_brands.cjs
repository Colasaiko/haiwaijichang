const fs = require('fs');

const jiuyun = {
  name: "九云",
  slug: "jiuyun",
  aff: "https://888.jiuyundl.com/#/register?code=RvrYuabu",
  discount: "9yun（8折）",
  features: [
    "海外中转，低延迟",
    "支持 Netflix / ChatGPT / TikTok",
    "3-5台设备同时在线",
    "智能路由自动择优，稳定顺滑"
  ],
  pricing: [
    { name: "特惠一", traffic: "200 GB", price: "¥68.00/年" },
    { name: "招财版", traffic: "150 GB", price: "¥6.00/月" },
    { name: "聚财版", traffic: "300 GB", price: "¥9.00/月" },
    { name: "旺财版", traffic: "600 GB", price: "¥16.00/月" },
    { name: "来财版", traffic: "100 GB", price: "¥68.00/一次性" },
    { name: "鸿运版", traffic: "300 GB", price: "¥99.00/一次性" }
  ]
};

const baoyun = {
  name: "宝云",
  slug: "baoyun",
  aff: "https://888by.baoyundl.com/#/register?code=9thDnaCR",
  discount: "暂无优惠",
  features: [
    "支持常规流媒体服务",
    "2-5台设备同时在线",
    "在线客服与售后技术支持",
    "高性价比轻量套餐可选"
  ],
  pricing: [
    { name: "年付轻量特惠", traffic: "100 GB", price: "¥32.00/年" },
    { name: "福宝", traffic: "200 GB", price: "¥4.00/月" },
    { name: "财宝", traffic: "500 GB", price: "¥8.00/月" },
    { name: "金宝", traffic: "1000 GB", price: "¥13.00/月" },
    { name: "传家宝", traffic: "200 GB", price: "¥29.00/一次性" },
    { name: "传世宝", traffic: "500 GB", price: "¥39.00/一次性" }
  ]
};

const shenxing = {
  name: "神行加速",
  slug: "shenxing",
  aff: "https://colasaiko15.shenxingaff.com/#/?code=Puzfv3vX",
  discount: "xs0077（新人7折）",
  features: [
    "IEPL 专线、VLESS 协议网络架构",
    "原生家宽 IP，最高带宽 500Mbps",
    "不限制设备连接数，三网优化",
    "完美解锁 Netflix/Disney+/ChatGPT/Claude"
  ],
  pricing: [
    { name: "神行·尝鲜包", traffic: "120 GB", price: "¥23.00/月" },
    { name: "神行·基础包", traffic: "260 GB", price: "¥40.00/月" },
    { name: "神行·尊享包", traffic: "520 GB", price: "¥72.00/月" },
    { name: "神行-年付特惠版", traffic: "60 GB", price: "¥96.00/年" }
  ]
};

const brandsPath = 'src/data/brands.json';
let brands = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));

// Insert after rank 10 (index 10)
brands.splice(10, 0, jiuyun, baoyun, shenxing);

fs.writeFileSync(brandsPath, JSON.stringify(brands, null, 2));
console.log('Successfully added 九云, 宝云, and 神行加速 to brands.json at index 10!');
