const fs = require('fs');
const matter = require('gray-matter');

const periodMonths = {
  "月付": 1,
  "季付": 3,
  "半年付": 6,
  "年付": 12,
  "二年付": 24,
  "三年付": 36,
  "一次性": 0
};

const pricingList = [
  { name: "天梯随行", traffic: "60GB/月", period: "年付", price: "¥89.00" },
  { name: "初阶网络·基础视界", traffic: "125GB/月", period: "月付", price: "¥25.00" },
  { name: "初阶网络·基础视界", traffic: "125GB/月", period: "季付", price: "¥71.25" },
  { name: "初阶网络·基础视界", traffic: "125GB/月", period: "半年付", price: "¥135.00" },
  { name: "初阶网络·基础视界", traffic: "125GB/月", period: "年付", price: "¥255.00" },
  { name: "初阶网络·基础视界", traffic: "125GB/月", period: "二年付", price: "¥480.00" },
  { name: "初阶网络·基础视界", traffic: "125GB/月", period: "三年付", price: "¥675.00" },
  { name: "中阶加速·极清多线", traffic: "350GB/月", period: "月付", price: "¥60.00" },
  { name: "中阶加速·极清多线", traffic: "350GB/月", period: "季付", price: "¥171.00" },
  { name: "中阶加速·极清多线", traffic: "350GB/月", period: "半年付", price: "¥324.00" },
  { name: "中阶加速·极清多线", traffic: "350GB/月", period: "年付", price: "¥612.00" },
  { name: "中阶加速·极清多线", traffic: "350GB/月", period: "二年付", price: "¥1152.00" },
  { name: "中阶加速·极清多线", traffic: "350GB/月", period: "三年付", price: "¥1620.00" },
  { name: "高阶专线·全球智联", traffic: "750GB/月", period: "月付", price: "¥110.00" },
  { name: "高阶专线·全球智联", traffic: "750GB/月", period: "季付", price: "¥313.50" },
  { name: "高阶专线·全球智联", traffic: "750GB/月", period: "半年付", price: "¥594.00" },
  { name: "高阶专线·全球智联", traffic: "750GB/月", period: "年付", price: "¥1122.00" },
  { name: "高阶专线·全球智联", traffic: "750GB/月", period: "二年付", price: "¥2112.00" },
  { name: "高阶专线·全球智联", traffic: "750GB/月", period: "三年付", price: "¥2970.00" },
  { name: "顶阶商业·全球骨干", traffic: "1.6TB/月", period: "月付", price: "¥190.00" },
  { name: "顶阶商业·全球骨干", traffic: "1.6TB/月", period: "季付", price: "¥541.50" },
  { name: "顶阶商业·全球骨干", traffic: "1.6TB/月", period: "半年付", price: "¥1026.00" },
  { name: "顶阶商业·全球骨干", traffic: "1.6TB/月", period: "年付", price: "¥1938.00" },
  { name: "顶阶商业·全球骨干", traffic: "1.6TB/月", period: "二年付", price: "¥3648.00" },
  { name: "顶阶商业·全球骨干", traffic: "1.6TB/月", period: "三年付", price: "¥5130.00" },
  { name: "不限时包120GB", traffic: "120GB", period: "一次性", price: "¥169.00" },
  { name: "不限时包350GB", traffic: "350GB", period: "一次性", price: "¥449.00" },
  { name: "不限时包700GB", traffic: "700GB", period: "一次性", price: "¥849.00" },
  { name: "私人定制", traffic: "500GB/月", period: "月付", price: "¥680.00" },
];

const trafficData = [];
const periodPrices = {};
const trafficSet = new Set();

pricingList.forEach(p => {
  let tVal = 0;
  const tStr = p.traffic.replace(/\/月/g, '').trim();
  if (tStr.toUpperCase().includes('GB')) {
    tVal = parseFloat(tStr);
  } else if (tStr.toUpperCase().includes('TB')) {
    tVal = parseFloat(tStr) * 1024;
  }
  
  if (tVal > 0 && !trafficSet.has(p.name)) {
    trafficSet.add(p.name);
    trafficData.push({
      label: p.name.split('·')[0], // Extract prefix
      plan: p.name,
      value: tVal,
      display: tStr
    });
  }
  
  if (!periodPrices[p.name]) {
    periodPrices[p.name] = [];
  }
  
  let m = periodMonths[p.period] || 0;
  let priceNum = parseFloat(p.price.replace(/[¥,]/g, ''));
  if (!isNaN(priceNum)) {
    periodPrices[p.name].push({
      period: p.period,
      months: m,
      price: priceNum
    });
  }
});

trafficData.sort((a,b) => a.value - b.value);

const visualData = {
  traffic: trafficData,
  periodPrices: periodPrices
};

const brandContent = {
  name: "梯子云",
  slug: "tizi",
  order: 25,
  seoTitle: "梯子云 怎么样？2026 最新套餐价格与 tiziyun 优惠码实测",
  seoDescription: "详细介绍梯子云机场，基础中转与多入口智能调度，全程不限速，全节点1x倍率。原生解锁 Netflix 与 ChatGPT，附最新 9 个套餐及优惠码指南。",
  h1: "梯子云 怎么样？基础中转架构、套餐价格与最新优惠码",
  heroDescription: "梯子云提供基础中转加多入口智能调度，所有节点均 1x 倍率。无设备并发限制，全程不限速，完美支持 Netflix、YouTube 和 ChatGPT，使用 Shadowsocks 协议，提供极致稳定的网络体验。",
  lineType: "基础中转+多入口智能调度",
  maxBandwidth: "不限速",
  ipType: "流媒体解锁",
  deviceLimit: "不限同时在线设备数",
  customerSupport: "官方技术支持",
  trafficReset: "根据套餐周期",
  clientSupport: "具体兼容性以官方当前支持情况为准",
  streamingSupport: ["Netflix", "YouTube"],
  aiSupport: ["ChatGPT"],
  features: [
    "基础中转 + 多入口智能调度",
    "全程不限速",
    "全节点 1x 计费倍率",
    "流媒体及 AI 解锁：支持 Netflix、YouTube、ChatGPT",
    "协议：全面采用 Shadowsocks 协议",
    "无设备限制：不限同时在线设备数"
  ],
  purchase: {
    label: "快速购买",
    url: "https://varnexa.ladderaff.com/#/?code=3vf6NG2u",
    cloaked: true
  },
  coupon: {
    code: "tiziyun",
    discountPercent: "20%",
    discount: "8折",
    scope: "常规套餐专用",
    description: "tiziyun 8折长期优惠码，仅适用于初阶网络、中阶加速、高阶专线、顶阶商业4个常规套餐。不包含天梯随行、一次性包及私人定制。",
    label: "常规套餐 8 折",
    eligiblePlans: [
      "初阶网络·基础视界",
      "中阶加速·极清多线",
      "高阶专线·全球智联",
      "顶阶商业·全球骨干"
    ]
  },
  temporaryCoupons: [
    {
      code: "2hy80",
      discountPercent: "20%",
      discount: "8折",
      manualActive: true, expiresAt: "2026-10-10T23:59:59Z",
      description: "双节优惠：适用于4个常规套餐的年付、二年付、三年付。",
      applicablePairs: [
        {
          plans: ["初阶网络·基础视界", "中阶加速·极清多线", "高阶专线·全球智联", "顶阶商业·全球骨干"],
          periods: ["年付", "二年付", "三年付"]
        }
      ]
    },
    {
      code: "2hy85",
      discountPercent: "15%",
      discount: "85折",
      manualActive: true, expiresAt: "2026-10-10T23:59:59Z",
      description: "双节优惠：适用于4个常规套餐的月付、季付、半年付。",
      applicablePairs: [
        {
          plans: ["初阶网络·基础视界", "中阶加速·极清多线", "高阶专线·全球智联", "顶阶商业·全球骨干"],
          periods: ["月付", "季付", "半年付"]
        }
      ]
    }
  ],
  pricing: pricingList,
  resetPackages: [
    { plan: "天梯随行", price: 89 },
    { plan: "初阶网络·基础视界", price: 25 },
    { plan: "中阶加速·极清多线", price: 60 },
    { plan: "高阶专线·全球智联", price: 110 },
    { plan: "顶阶商业·全球骨干", price: 190 },
    { plan: "私人定制", price: 680 }
  ],
  visualData: visualData
};

const markdownContent = `
根据当前收录的官方品牌资料，**梯子云** 提供了适合不同需求用户的网络加速方案。请注意，目前站内对该品牌的独立测试数据仍在完善中，实际体验可能受限于您所在地区的网络环境和运营商（如电信、联通、移动）的路由差异。

### 已知服务特征
- 基础中转 + 多入口智能调度
- 全程不限速，全节点 1x 计费倍率
- 原生 IP 解锁 Netflix、YouTube、ChatGPT
- 全面采用 Shadowsocks 协议
- 不限制同时在线设备数量

优惠码特别说明：长期优惠 **tiziyun**（8折）及双节临时优惠 **2hy80**、**2hy85** 实测仅适用于初阶网络、中阶加速、高阶专线和顶阶商业4个常规套餐的常规周期。天梯随行、三个不限时包和私人定制暂不享受优惠。
`;

const output = matter.stringify(markdownContent, brandContent);
fs.writeFileSync('src/content/brands/tizi.md', output, 'utf8');
console.log('Updated tizi.md');
