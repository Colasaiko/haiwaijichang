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
  { name: "浪网 年付标准", traffic: "80GB/月", period: "年付", price: "¥119.00" },
  { name: "浪网 入门", traffic: "150GB/月", period: "月付", price: "¥30.00" },
  { name: "浪网 入门", traffic: "150GB/月", period: "季付", price: "¥85.50" },
  { name: "浪网 入门", traffic: "150GB/月", period: "半年付", price: "¥162.00" },
  { name: "浪网 入门", traffic: "150GB/月", period: "年付", price: "¥306.00" },
  { name: "浪网 入门", traffic: "150GB/月", period: "二年付", price: "¥576.00" },
  { name: "浪网 入门", traffic: "150GB/月", period: "三年付", price: "¥810.00" },
  { name: "浪网 进阶", traffic: "400GB/月", period: "月付", price: "¥70.00" },
  { name: "浪网 进阶", traffic: "400GB/月", period: "季付", price: "¥199.50" },
  { name: "浪网 进阶", traffic: "400GB/月", period: "半年付", price: "¥378.00" },
  { name: "浪网 进阶", traffic: "400GB/月", period: "年付", price: "¥714.00" },
  { name: "浪网 进阶", traffic: "400GB/月", period: "二年付", price: "¥1344.00" },
  { name: "浪网 进阶", traffic: "400GB/月", period: "三年付", price: "¥1890.00" },
  { name: "浪网 高端", traffic: "800GB/月", period: "月付", price: "¥120.00" },
  { name: "浪网 高端", traffic: "800GB/月", period: "季付", price: "¥342.00" },
  { name: "浪网 高端", traffic: "800GB/月", period: "半年付", price: "¥648.00" },
  { name: "浪网 高端", traffic: "800GB/月", period: "年付", price: "¥1224.00" },
  { name: "浪网 高端", traffic: "800GB/月", period: "二年付", price: "¥2304.00" },
  { name: "浪网 高端", traffic: "800GB/月", period: "三年付", price: "¥3240.00" },
  { name: "浪网 商业", traffic: "2TB/月", period: "月付", price: "¥200.00" },
  { name: "浪网 商业", traffic: "2TB/月", period: "季付", price: "¥570.00" },
  { name: "浪网 商业", traffic: "2TB/月", period: "半年付", price: "¥1080.00" },
  { name: "浪网 商业", traffic: "2TB/月", period: "年付", price: "¥2040.00" },
  { name: "浪网 商业", traffic: "2TB/月", period: "二年付", price: "¥3840.00" },
  { name: "浪网 商业", traffic: "2TB/月", period: "三年付", price: "¥5400.00" },
  { name: "浪网 小流量包", traffic: "180GB", period: "一次性", price: "¥239.00" },
  { name: "浪网 标准流量包", traffic: "450GB", period: "一次性", price: "¥569.00" },
  { name: "浪网 精英流量包", traffic: "900GB", period: "一次性", price: "¥1099.00" },
  { name: "浪网 定制线路", traffic: "500GB/月", period: "月付", price: "¥680.00" },
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
      label: p.name.replace('浪网 ', ''),
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
  name: "浪网 WaveNet",
  slug: "wavenet",
  order: 26,
  seoTitle: "浪网 WaveNet 怎么样？2026 最新套餐价格与优惠码实测",
  seoDescription: "浪网 WaveNet 采用 BGP多线智能调度 + 专线出口，全程不限速，提供 Shadowsocks 节点。完美支持 Netflix/Disney+ 和 ChatGPT 解锁。",
  h1: "浪网 WaveNet 怎么样？BGP与专线出口、套餐与最新优惠码",
  heroDescription: "浪网 WaveNet 采用 BGP多线智能调度结合专线出口，所有节点均为 1x 倍率。无设备并发限制（除部分小包），全程不限速，流媒体支持卓越，同时支持多款 AI 工具，满足高要求的网络加速体验。",
  lineType: "BGP多线智能调度+专线出口",
  maxBandwidth: "不限速",
  nodeCoverage: {
    total: "约60+",
    regions: ["日本", "新加坡", "美国", "香港", "台湾"]
  },
  paymentMethods: ["支付宝", "USDT"],
  deviceLimit: "常规套餐不限同时在线设备数",
  customerSupport: "官方技术支持",
  trafficReset: "根据套餐周期",
  clientSupport: "具体兼容性以官方当前支持情况为准",
  streamingSupport: ["Netflix", "Disney+", "HBO Max"],
  aiSupport: ["ChatGPT", "Claude"],
  features: [
    "BGP 多线智能调度 + 专线出口",
    "全程不限速",
    "全节点 1x 计费倍率",
    "采用 Shadowsocks 协议",
    "约 60 节点，覆盖日本、新加坡、美国、香港、台湾",
    "支持支付宝与 USDT 支付",
    "流媒体解锁：支持 Netflix、Disney+、HBO Max",
    "AI 解锁：支持 ChatGPT、Claude",
    "常规套餐不限同时在线设备数",
    "小流量包限 1 台设备",
    "定制线路提供独立公网 IP 与独占带宽"
  ],
  purchase: {
    label: "快速购买",
    url: "https://varnexa.wavenetaff.com/#/?code=pcFhy7Lb",
    cloaked: true
  },
  coupon: {
    code: "lw888",
    discountPercent: "20%",
    discount: "8折",
    scope: "新户专属，常规套餐专用",
    description: "lw888 8折新户专属优惠码，仅适用于浪网 入门、浪网 进阶、浪网 高端、浪网 商业四个常规套餐的全部付款周期。其余特殊套餐及流量包不适用。",
    label: "新户专属 8 折",
    eligiblePlans: [
      "浪网 入门",
      "浪网 进阶",
      "浪网 高端",
      "浪网 商业"
    ]
  },
  pricing: pricingList,
  resetPackages: [
    { plan: "浪网 年付标准", price: 89 },
    { plan: "浪网 入门", price: 30 },
    { plan: "浪网 进阶", price: 68 },
    { plan: "浪网 高端", price: 120 },
    { plan: "浪网 商业", price: 195 },
    { plan: "浪网 定制线路", price: 680 }
  ],
  visualData: visualData
};

const markdownContent = `根据当前收录的官方品牌资料，**浪网 WaveNet** 提供了稳定高速的网络加速方案。从常规流量套餐到特殊定制线路，满足了普通浏览、流媒体重度用户甚至企业级定制的需求。

### 已知服务特征
- **BGP多线智能调度 + 专线出口**：结合 BGP 与专线优势，优化延迟和稳定性。
- **全程不限速，全节点 1x 计费**：确保高峰期带宽，且无多倍率节点造成的流量焦虑。
- **协议与设备支持**：采用 Shadowsocks 协议，常规套餐不限制在线设备数（小流量包限制 1 台）。
- **节点覆盖**：提供约 60 个节点，主要覆盖香港、台湾、日本、新加坡、美国等核心区域。
- **解锁支持**：有效解锁 Netflix、Disney+、HBO Max 及 ChatGPT、Claude 等海外流媒体与 AI 应用。
- **支付与定制**：支持支付宝和 USDT，高级定制线路享有独立公网 IP 与独占带宽。

优惠码特别说明：当前 **lw888**（新户专属 8折）仅适用于“浪网 入门”、“浪网 进阶”、“浪网 高端”、“浪网 商业”四个常规套餐的所有周期。其余如年付标准、一次性流量包以及定制线路均不享受该折扣。目前未确认其他限时活动。`;

const output = matter.stringify(markdownContent, brandContent);
fs.writeFileSync('src/content/brands/wavenet.md', output, 'utf8');
console.log('Updated wavenet.md');
