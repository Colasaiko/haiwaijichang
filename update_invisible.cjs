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
  { name: "隐形人 星耀风暴", traffic: "80GB/月", period: "年付", price: "¥109.00" },
  { name: "隐形人 白银纪元", traffic: "144GB/月", period: "月付", price: "¥24.00" },
  { name: "隐形人 白银纪元", traffic: "144GB/月", period: "季付", price: "¥68.40" },
  { name: "隐形人 白银纪元", traffic: "144GB/月", period: "半年付", price: "¥129.60" },
  { name: "隐形人 白银纪元", traffic: "144GB/月", period: "年付", price: "¥244.80" },
  { name: "隐形人 白银纪元", traffic: "144GB/月", period: "二年付", price: "¥460.80" },
  { name: "隐形人 白银纪元", traffic: "144GB/月", period: "三年付", price: "¥648.00" },
  { name: "隐形人 黄金序列", traffic: "360GB/月", period: "月付", price: "¥48.00" },
  { name: "隐形人 黄金序列", traffic: "360GB/月", period: "季付", price: "¥136.80" },
  { name: "隐形人 黄金序列", traffic: "360GB/月", period: "半年付", price: "¥259.20" },
  { name: "隐形人 黄金序列", traffic: "360GB/月", period: "年付", price: "¥489.60" },
  { name: "隐形人 黄金序列", traffic: "360GB/月", period: "二年付", price: "¥921.60" },
  { name: "隐形人 黄金序列", traffic: "360GB/月", period: "三年付", price: "¥1293.00" },
  { name: "隐形人 铂金至臻", traffic: "750GB/月", period: "月付", price: "¥105.00" },
  { name: "隐形人 铂金至臻", traffic: "750GB/月", period: "季付", price: "¥299.25" },
  { name: "隐形人 铂金至臻", traffic: "750GB/月", period: "半年付", price: "¥567.00" },
  { name: "隐形人 铂金至臻", traffic: "750GB/月", period: "年付", price: "¥1071.00" },
  { name: "隐形人 铂金至臻", traffic: "750GB/月", period: "二年付", price: "¥2016.00" },
  { name: "隐形人 铂金至臻", traffic: "750GB/月", period: "三年付", price: "¥2835.00" },
  { name: "隐形人 钻石穹顶", traffic: "1600GB/月", period: "月付", price: "¥185.00" },
  { name: "隐形人 钻石穹顶", traffic: "1600GB/月", period: "季付", price: "¥527.25" },
  { name: "隐形人 钻石穹顶", traffic: "1600GB/月", period: "半年付", price: "¥999.00" },
  { name: "隐形人 钻石穹顶", traffic: "1600GB/月", period: "年付", price: "¥1887.00" },
  { name: "隐形人 钻石穹顶", traffic: "1600GB/月", period: "二年付", price: "¥3552.00" },
  { name: "隐形人 钻石穹顶", traffic: "1600GB/月", period: "三年付", price: "¥4995.00" },
  { name: "隐形人 一次性小流量包", traffic: "160GB", period: "一次性", price: "¥229.00" },
  { name: "隐形人 一次性标准包", traffic: "420GB", period: "一次性", price: "¥549.00" },
  { name: "隐形人 一次性精英包", traffic: "1000GB", period: "一次性", price: "¥1199.00" },
  { name: "隐形人 王者定制版", traffic: "500GB/月", period: "月付", price: "¥680.00" },
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
      label: p.name.replace('隐形人 ', ''),
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
  name: "隐形人",
  slug: "invisible",
  order: 28,
  seoTitle: "隐形人 Invisible 怎么样？2026 最新套餐价格与优惠码实测",
  seoDescription: "隐形人 (Invisible) 机场采用 IEPL 专线，VLESS 协议，全节点 1x 倍率且不限速。完美解锁 Netflix/Prime Video 及 ChatGPT/Copilot，不限设备数。",
  h1: "隐形人 Invisible 怎么样？IEPL 专线、VLESS 套餐与优惠码",
  heroDescription: "隐形人 (Invisible) 致力于提供全天候的稳定连接体验。采用高级 IEPL 专线搭配 VLESS 协议，全节点无套路 1x 倍率，全程不限速。丰富的流媒体与开发级 AI 工具解锁，且不限制在线设备数，为您打造真正的无感极速网络。",
  lineType: "IEPL 专线",
  maxBandwidth: "不限速",
  nodeCoverage: {
    total: "约60节点",
    regions: ["香港", "台湾", "日本", "新加坡", "美国"]
  },
  deviceLimit: "不限制在线设备数",
  paymentMethods: ["支付宝", "USDT"],
  customerSupport: "官方技术支持",
  trafficReset: "根据套餐周期",
  clientSupport: "具体兼容性以官方当前支持情况为准",
  streamingSupport: ["Netflix", "Prime Video", "BBC", "Abema", "TVer"],
  aiSupport: ["ChatGPT", "GitHub Copilot", "Hugging Face"],
  features: [
    "优质 IEPL 专线",
    "全程不限速",
    "采用最新 VLESS 协议",
    "全节点 1x 计费倍率",
    "提供约 60 个节点，涵盖香港、台湾、日本、新加坡、美国",
    "深度流媒体解锁：支持 Netflix、Prime Video、BBC、Abema、TVer",
    "开发者级 AI 解锁：支持 ChatGPT、GitHub Copilot、Hugging Face",
    "完全不限制在线设备数量",
    "支持支付宝与 USDT 结算"
  ],
  purchase: {
    label: "快速购买",
    url: "https://varnexa.invisibleaff.com/#/?code=8jyAXfu3",
    cloaked: true
  },
  coupon: {
    code: "yxr888",
    discountPercent: "20%",
    discount: "8折",
    scope: "四款常规套餐专享",
    label: "常规套餐 8 折",
    description: "常驻 8折 优惠码 yxr888 仅适用于隐形人的四款常规套餐（白银纪元、黄金序列、铂金至臻、钻石穹顶）的全部周期。",
    eligiblePlans: [
      "隐形人 白银纪元",
      "隐形人 黄金序列",
      "隐形人 铂金至臻",
      "隐形人 钻石穹顶"
    ]
  },
  temporaryCoupons: [
    {
      code: "moon80",
      discountPercent: "20%",
      discount: "8折",
      manualActive: true,
      expiresAt: "2026-10-10T23:59:59+08:00",
      description: "限时活动：年付及以上周期 8折 优惠（含星耀风暴年付）。",
      applicablePairs: [
        {
          plans: ["隐形人 白银纪元", "隐形人 黄金序列", "隐形人 铂金至臻", "隐形人 钻石穹顶", "隐形人 星耀风暴"],
          periods: ["年付", "二年付", "三年付"]
        }
      ]
    },
    {
      code: "moon85",
      discountPercent: "15%",
      discount: "85折",
      manualActive: true,
      expiresAt: "2026-10-10T23:59:59+08:00",
      description: "限时活动：半年付及以内周期 85折 优惠（含王者定制版月付）。",
      applicablePairs: [
        {
          plans: ["隐形人 白银纪元", "隐形人 黄金序列", "隐形人 铂金至臻", "隐形人 钻石穹顶", "隐形人 王者定制版"],
          periods: ["月付", "季付", "半年付"]
        }
      ]
    }
  ],
  pricing: pricingList,
  resetPackages: [
    { plan: "隐形人 星耀风暴", price: 109 },
    { plan: "隐形人 白银纪元", price: 24 },
    { plan: "隐形人 黄金序列", price: 48 },
    { plan: "隐形人 铂金至臻", price: 105 },
    { plan: "隐形人 钻石穹顶", price: 185 },
    { plan: "隐形人 王者定制版", price: 680 }
  ],
  visualData: visualData
};

const markdownContent = [
  "根据当前收录的官方品牌资料，**隐形人 (Invisible)** 是一家提供高质量全线 IEPL 专线的低调网络加速服务商。凭借先进的 VLESS 协议与无任何设备并发限制的策略，为您提供极其宽松而稳定的重度网络体验。",
  "",
  "### 已知服务特征",
  "- **IEPL 高速专线**：无惧国际网络抖动，保障全天候高质量的网络传输。",
  "- **全系不限速与透明计费**：全程不限制连接速度，且全站节点均采用 1x 倍率，无隐藏的高倍消耗。",
  "- **卓越流媒体与开发者 AI 解锁**：不仅支持常规 Netflix、Prime Video 解锁，还覆盖了 BBC、Abema、TVer 等小众流媒体，同时完美支持开发者常用的 GitHub Copilot 与 Hugging Face 等 AI 及代码托管平台。",
  "- **无设备数限制**：全系不限制在线设备数，非常适合家庭成员共享或极客多设备的开发场景。",
  "",
  "**优惠说明**：",
  "常驻优惠 **yxr888** 依然有效（常规四款套餐均可使用）。",
  "当前正值限时活动（有效期至 2026-10-10）：",
  "- 年付周期（包含星耀风暴套餐）可使用 **moon80** 享 8折。",
  "- 月付、季付、半年付（包含王者定制版）可使用 **moon85** 享 85折。",
  "*注意：三款一次性不限时流量包（160GB、420GB、1000GB）均不参与任何优惠折扣。*"
].join("\\n");

const output = matter.stringify(markdownContent, brandContent);
fs.writeFileSync('src/content/brands/invisible.md', output, 'utf8');
console.log('Updated invisible.md');