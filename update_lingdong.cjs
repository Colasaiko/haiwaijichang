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
  { name: "穿云", traffic: "79GB/月", period: "年付", price: "¥99.00" },
  { name: "拂风", traffic: "100GB/月", period: "月付", price: "¥20.00" },
  { name: "拂风", traffic: "100GB/月", period: "季付", price: "¥57.00" },
  { name: "拂风", traffic: "100GB/月", period: "半年付", price: "¥108.00" },
  { name: "拂风", traffic: "100GB/月", period: "年付", price: "¥204.00" },
  { name: "拂风", traffic: "100GB/月", period: "二年付", price: "¥384.00" },
  { name: "拂风", traffic: "100GB/月", period: "三年付", price: "¥540.00" },
  { name: "驭浪", traffic: "300GB/月", period: "月付", price: "¥50.00" },
  { name: "驭浪", traffic: "300GB/月", period: "季付", price: "¥142.50" },
  { name: "驭浪", traffic: "300GB/月", period: "半年付", price: "¥270.00" },
  { name: "驭浪", traffic: "300GB/月", period: "年付", price: "¥510.00" },
  { name: "驭浪", traffic: "300GB/月", period: "二年付", price: "¥960.00" },
  { name: "驭浪", traffic: "300GB/月", period: "三年付", price: "¥1350.00" },
  { name: "破晓", traffic: "700GB/月", period: "月付", price: "¥100.00" },
  { name: "破晓", traffic: "700GB/月", period: "季付", price: "¥285.00" },
  { name: "破晓", traffic: "700GB/月", period: "半年付", price: "¥540.00" },
  { name: "破晓", traffic: "700GB/月", period: "年付", price: "¥1020.00" },
  { name: "破晓", traffic: "700GB/月", period: "二年付", price: "¥1920.00" },
  { name: "破晓", traffic: "700GB/月", period: "三年付", price: "¥2700.00" },
  { name: "凌霄", traffic: "1500GB/月", period: "月付", price: "¥180.00" },
  { name: "凌霄", traffic: "1500GB/月", period: "季付", price: "¥513.00" },
  { name: "凌霄", traffic: "1500GB/月", period: "半年付", price: "¥972.00" },
  { name: "凌霄", traffic: "1500GB/月", period: "年付", price: "¥1836.00" },
  { name: "凌霄", traffic: "1500GB/月", period: "二年付", price: "¥3456.00" },
  { name: "凌霄", traffic: "1500GB/月", period: "三年付", price: "¥4860.00" },
  { name: "闲云", traffic: "150GB", period: "一次性", price: "¥199.00" },
  { name: "惊云", traffic: "400GB", period: "一次性", price: "¥499.00" },
  { name: "飞云", traffic: "800GB", period: "一次性", price: "¥899.00" },
  { name: "至尊私人定制", traffic: "500GB/月", period: "月付", price: "¥680.00" }
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
      label: p.name,
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
  name: "灵动网络",
  slug: "lingdong",
  order: 27,
  seoTitle: "灵动网络 怎么样？2026 最新套餐价格与优惠码实测",
  seoDescription: "灵动网络采用纯专线+BGP三网优化，晚高峰不限速，全节点1x倍率。支持Netflix、Disney+、ChatGPT等，提供Shadowsocks原生纯净IP。",
  h1: "灵动网络 怎么样？纯专线与原生IP、套餐与最新优惠码",
  heroDescription: "灵动网络凭借纯专线+BGP三网优化的强力架构，确保晚高峰期间依然不限速。所有节点均为 1x 倍率，多设备同时在线无压力。原生纯净 IP 完美解锁各类流媒体及 AI 应用。",
  lineType: "纯专线+BGP三网优化",
  maxBandwidth: "晚高峰不限速",
  nodeCoverage: {
    total: "多个核心节点",
    regions: []
  },
  deviceLimit: "多设备同时在线",
  customerSupport: "官方技术支持",
  trafficReset: "根据套餐周期",
  clientSupport: "具体兼容性以官方当前支持情况为准",
  streamingSupport: ["Netflix", "Disney+", "HBO"],
  aiSupport: ["ChatGPT", "Claude"],
  features: [
    "纯专线 + BGP三网优化",
    "晚高峰不限速",
    "全节点 1x 计费倍率",
    "采用 Shadowsocks 协议",
    "提供原生纯净 IP",
    "流媒体解锁：支持 Netflix、Disney+、HBO",
    "AI 解锁：支持 ChatGPT、Claude",
    "多设备同时在线无忧",
    "至尊私人定制提供独立公网 IP 与独立带宽"
  ],
  purchase: {
    label: "快速购买",
    url: "https://varnexa.lingdongaff.com/#/?code=TIMwZeIR",
    cloaked: true
  },
  temporaryCoupons: [
    {
      code: "zq88",
      discountPercent: "20%",
      discount: "8折",
      manualActive: true,
      expiresAt: "2026-10-25T23:59:59+08:00",
      description: "限时优惠：年付、二年付、三年付周期享 8折。",
      applicablePairs: [
        {
          plans: ["穿云", "拂风", "驭浪", "破晓", "凌霄", "至尊私人定制"],
          periods: ["年付", "二年付", "三年付"]
        }
      ]
    },
    {
      code: "zq85",
      discountPercent: "15%",
      discount: "85折",
      manualActive: true,
      expiresAt: "2026-10-25T23:59:59+08:00",
      description: "限时优惠：月付、季付、半年付周期享 85折。",
      applicablePairs: [
        {
          plans: ["穿云", "拂风", "驭浪", "破晓", "凌霄", "至尊私人定制"],
          periods: ["月付", "季付", "半年付"]
        }
      ]
    }
  ],
  pricing: pricingList,
  resetPackages: [
    { plan: "穿云", price: 99 },
    { plan: "拂风", price: 20 },
    { plan: "驭浪", price: 50 },
    { plan: "破晓", price: 100 },
    { plan: "凌霄", price: 180 },
    { plan: "至尊私人定制", price: 680 }
  ],
  visualData: visualData
};

const markdownContent = `根据当前收录的官方品牌资料，**灵动网络** 提供极为强悍的网络加速服务，其出色的网络架构和纯净的原生 IP ，为需要极致稳定体验的用户带来了完美解决方案。

### 已知服务特征
- **纯专线 + BGP三网优化**：全线采用高端专线，无惧晚高峰拥堵，全程不限速。
- **全节点 1x 计费倍率**：透明无套路，所有节点一致计费倍率，告别高倍率流量消耗焦虑。
- **原生纯净 IP 与解锁能力**：稳定解锁 Netflix、Disney+、HBO 及 ChatGPT、Claude，体验如原生网络般流畅。
- **多设备在线**：支持多设备同时在线，满足多终端及轻团队使用需求。
- **私人定制专属**：高级私人定制计划享有独立公网 IP 与独立带宽，极大满足对纯净度和性能有极高要求的高端用户。

**优惠码特别说明**：旧版 \`880223\` 优惠码当前已失效。
目前官方正在进行双节活动（有效期至 \`2026-10-25\`）：
- 年付及以上周期可使用 **zq88** 获取 8折 优惠。
- 月付、季付、半年付周期可使用 **zq85** 获取 85折 优惠。
*(注：闲云、惊云、飞云三个一次性流量包均不参与该折扣活动)*`;

const output = matter.stringify(markdownContent, brandContent);
fs.writeFileSync('src/content/brands/lingdong.md', output, 'utf8');
console.log('Updated lingdong.md');
