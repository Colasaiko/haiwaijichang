const fs = require('fs');

let c = fs.readFileSync('src/content/brands/edge.md', 'utf8');

c = c.replace(/features:\n  lineType: "全 IPLC 专线"\n  maxBandwidth: "官方标示最高2\.5Gbps"\n  ipType: "原生IP"\n  deviceLimit: "不限制同时在线客户端数量"\n  streaming: "全面支持 Netflix、Disney\+ 等流媒体及 ChatGPT、TikTok 等应用"\n  nodeCoverage:\n    total: "60\+"\n    counts:\n      香港: 20\n      台湾: 10\n      日本: 10\n      新加坡: 10\n      美国: 10\n      韩国: 3\n    description: "涵盖香港、台湾、日本、新加坡、美国、韩国，并包含马来西亚、土耳其、德国、法国、英国等地区节点。"\n  trafficReset: "常规套餐及限时套餐以月\/年等自然周期进行流量重置；永久不限时包长期有效不自动重置。"\n  protocols: "不支持 Clash\/VLESS\/SS 等旧协议信息披露，官方提供自研客户端"/, 
`features:
  - "全 IPLC 专线"
  - "官方标示最高2.5Gbps"
  - "原生IP"
  - "不限制同时在线客户端数量"
  - "全面支持 Netflix、Disney+ 等流媒体及 ChatGPT、TikTok 等应用"
  - "涵盖香港、台湾、日本、新加坡、美国、韩国，并包含马来西亚、土耳其、德国、法国、英国等地区节点。"
  - "常规套餐及限时套餐以月/年等自然周期进行流量重置；永久不限时包长期有效不自动重置。"
  - "不支持 Clash/VLESS/SS 等旧协议信息披露，官方提供自研客户端"

nodeCoverage:
  total: "60+"
  counts:
    香港: 20
    台湾: 10
    日本: 10
    新加坡: 10
    美国: 10
    韩国: 3`);

fs.writeFileSync('src/content/brands/edge.md', c);
