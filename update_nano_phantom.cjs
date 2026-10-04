const fs = require('fs');
const matter = require('gray-matter');

const periodMonths = {
  "月付": 1,
  "年付": 12,
};

function generateVisualData(pricingList) {
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

  return { traffic: trafficData, periodPrices: periodPrices };
}

// --- NanoCloud ---
const nanoPricing = [
  { name: "猎户座", traffic: "100GB/月", period: "月付", price: "¥1.00" },
  { name: "猎户座", traffic: "100GB/月", period: "年付", price: "¥12.00" },
  { name: "白羊座", traffic: "300GB/月", period: "月付", price: "¥10.00" },
  { name: "白羊座", traffic: "300GB/月", period: "年付", price: "¥120.00" },
  { name: "双鱼座", traffic: "480GB/月", period: "月付", price: "¥15.00" },
  { name: "双鱼座", traffic: "480GB/月", period: "年付", price: "¥180.00" },
  { name: "射手座", traffic: "650GB/月", period: "月付", price: "¥20.00" },
  { name: "射手座", traffic: "650GB/月", period: "年付", price: "¥240.00" }
];

const nanoContent = {
  name: "NanoCloud",
  slug: "nanocloud",
  order: 29,
  seoTitle: "NanoCloud 怎么样？2026 最新套餐价格与评测",
  seoDescription: "NanoCloud 提供 IPv4/IPv6 双栈网络，支持 Android/Windows/macOS/iOS 客户端，流媒体与 AI 全面解锁，年付低至12元起。",
  h1: "NanoCloud 怎么样？IPv4/IPv6 双栈网络与最新价格",
  heroDescription: "NanoCloud 是一款高性价比的网络加速服务。支持 IPv4/IPv6 双栈访问，并提供全平台的定制客户端与 Telegram Bot 便利操作。流媒体解锁涵盖 Netflix、Disney+、YouTube 等主流平台，同时完美支持 ChatGPT 和 TikTok，入门套餐低至每月 1 元。",
  streamingSupport: ["Netflix", "Disney+", "YouTube"],
  aiSupport: ["ChatGPT", "TikTok"],
  clientSupport: "Android / Windows / macOS / iOS",
  features: [
    "支持 IPv4 / IPv6 双栈网络",
    "提供全平台客户端 (Android, Windows, macOS, iOS)",
    "内置功能完善的 Telegram Bot",
    "流媒体解锁：支持 Netflix, Disney+, YouTube",
    "AI 与社媒解锁：支持 ChatGPT, TikTok",
    "阶梯带宽配置：100Mbps、300Mbps、500Mbps 及不限速套餐",
    "灵活的设备限制：支持 2~10 台设备同时在线"
  ],
  purchase: {
    label: "快速购买",
    url: "https://edu.uodoo.bid/auth/register?code=P7gzTydW",
    cloaked: true
  },
  pricing: nanoPricing,
  visualData: generateVisualData(nanoPricing)
};

const nanoMD = `根据当前收录的官方品牌资料，**NanoCloud** 以极高的性价比和全面的客户端生态，为不同需求的用户提供了灵活的网络接入方案。

### 已知服务特征
- **IPv4/IPv6 双栈网络**：全面兼容下一代互联网标准，网络接入更加顺畅。
- **全平台客户端**：官方提供适用于 Android、Windows、macOS、iOS 的专属客户端，配合 Telegram Bot，日常操作与订阅管理极度便捷。
- **强力解锁能力**：可靠解锁 Netflix、Disney+、YouTube 等国际流媒体，以及 ChatGPT 与 TikTok，满足娱乐与生产力双重需求。
- **差异化套餐设计**：
  - **猎户座** (100Mbps，2台设备)
  - **白羊座** (300Mbps，5台设备)
  - **双鱼座** (500Mbps，8台设备)
  - **射手座** (不限速，10台设备)

**优惠说明**：
NanoCloud 当前暂无通用的公开优惠码，请加入官方 TG 群组获取最新内部专属优惠及活动信息。`;

fs.writeFileSync('src/content/brands/nanocloud.md', matter.stringify(nanoMD.replace(/\\n/g, '\n'), nanoContent), 'utf8');
console.log('Updated nanocloud.md');

// --- Phantom ---
const phantomPricing = [
  { name: "天蝎座", traffic: "100GB/月", period: "月付", price: "¥1.00" },
  { name: "天蝎座", traffic: "100GB/月", period: "年付", price: "¥12.00" },
  { name: "水瓶座", traffic: "300GB/月", period: "月付", price: "¥10.00" },
  { name: "水瓶座", traffic: "300GB/月", period: "年付", price: "¥120.00" },
  { name: "双子座", traffic: "650GB/月", period: "月付", price: "¥20.00" },
  { name: "双子座", traffic: "650GB/月", period: "年付", price: "¥240.00" }
];

const phantomContent = {
  name: "Phantom",
  slug: "phantom",
  order: 30,
  seoTitle: "Phantom 怎么样？2026 最新直连线路套餐价格与评测",
  seoDescription: "Phantom (2025年上线) 是一家主打直连线路的新晋服务商。提供香港、日本、台湾、新加坡、美国节点，支持 VLESS/TUIC/Hysteria2 协议及全平台定制客户端。",
  h1: "Phantom 怎么样？直连线路、前沿协议与最新价格",
  heroDescription: "Phantom 成立于 2025 年，是一家主打高性价比直连线路的优质服务商。采用 VLESS、TUIC、Hysteria2 等前沿协议组合，节点涵盖香港、日本、台湾、新加坡、美国等热门地区，并提供专有定制客户端。支持支付宝与微信支付，降低了用户的购买门槛。",
  established: "2025",
  lineType: "直连线路",
  paymentMethods: ["支付宝", "微信"],
  nodeCoverage: {
    total: "多个核心节点",
    regions: ["香港", "日本", "台湾", "新加坡", "美国"]
  },
  clientSupport: "提供定制客户端",
  features: [
    "2025 年全新上线",
    "主打高性价比直连线路",
    "采用前沿协议矩阵：支持 VLESS、TUIC、Hysteria2",
    "核心地区覆盖：香港、日本、台湾、新加坡、美国",
    "官方提供定制化客户端支持",
    "支持支付宝与微信支付付款"
  ],
  purchase: {
    label: "快速购买",
    url: "https://pin.dianping.men/auth/register?code=Cv2pH8HA",
    cloaked: true
  },
  pricing: phantomPricing,
  visualData: generateVisualData(phantomPricing)
};

const phantomMD = `根据当前收录的官方品牌资料，**Phantom** 是一家 2025 年全新上线的高性价比服务商，凭借直连线路与多种最新协议的组合，在入门级市场提供了极具竞争力的选择。

### 已知服务特征
- **前沿协议矩阵**：除了 VLESS 之外，还支持了对弱网环境抗性极佳的 TUIC 与 Hysteria2 协议，大幅提升连接成功率与速率。
- **直连优选节点**：核心节点覆盖香港、日本、台湾、新加坡、美国等主流区域，满足绝大多数常规网络加速需求。
- **友好易用**：官方开发并提供定制客户端，且全面支持支付宝与微信支付，对新手用户非常友好。

**优惠说明**：
Phantom 暂无公开优惠码，套餐本身已经处于极致性价比状态（低至 1 元/月），具体变动请以官方控制台公告为准。`;

fs.writeFileSync('src/content/brands/phantom.md', matter.stringify(phantomMD.replace(/\\n/g, '\n'), phantomContent), 'utf8');
console.log('Updated phantom.md');
