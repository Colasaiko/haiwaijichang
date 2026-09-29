const fs = require('fs');
let brands = JSON.parse(fs.readFileSync('src/data/brands.json', 'utf8'));

const fireflyIntro = `<p><strong>Firefly</strong> 致力于为用户提供稳定、高质量的网络连接体验，采用 IPLC 专线，具备低延迟、高稳定性的特点，并使用 VLESS 协议。全节点不限速，不限制客户端及设备数量，满足日常使用、影音娱乐、AI 工具及办公等多种需求。</p>
<p>品牌拥有海外技术团队持续维护线路，提供响应迅速的客服支持和经验丰富的运营保障。节点提供原生 IP，支持 YouTube、Netflix、Disney+、HBO 等主流流媒体解锁，同时兼容 ChatGPT、Gemini、Claude 等 AI 服务。</p>
<p>此外，Firefly 还提供企业定制方案，并支持免翻墙访问官网及相关服务，方便用户随时获取订阅和售后支持。定位为稳定可靠的长期主力机场，适合满足日常娱乐、流媒体、AI 工具及轻度办公等多种场景。</p>`;

brands.forEach(b => {
  if (b.name.includes('FireFly') || b.name.includes('萤火虫')) {
    b.intro = fireflyIntro;
    b.established = "2026年（背后的技术和运营团队有8年行内经验）";
    b.telegram = "https://t.me/fireflyjichang";
    b.payment = "USDT (trc20)、微信支付、支付宝";
    b.protocols = "VLESS";
    b.nodes = "香港、台湾、新加坡、日本、美国";
  }
});

fs.writeFileSync('src/data/brands.json', JSON.stringify(brands, null, 2));
console.log('Updated Firefly info in brands.json');
