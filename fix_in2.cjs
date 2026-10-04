const fs = require('fs');
let c = fs.readFileSync('update_invisible.cjs', 'utf8');
const text = '根据当前收录的官方品牌资料，**隐形人 (Invisible)** 是一家提供高质量全线 IEPL 专线的低调网络加速服务商。凭借先进的 VLESS 协议与无任何设备并发限制的策略，为您提供极其宽松而稳定的重度网络体验。\\n\\n### 已知服务特征\\n- **IEPL 高速专线**：无惧国际网络抖动，保障全天候高质量的网络传输。\\n- **全系不限速与透明计费**：全程不限制连接速度，且全站节点均采用 1x 倍率，无隐藏的高倍消耗。\\n- **卓越流媒体与开发者 AI 解锁**：不仅支持常规 Netflix、Prime Video 解锁，还覆盖了 BBC、Abema、TVer 等小众流媒体，同时完美支持开发者常用的 GitHub Copilot 与 Hugging Face 等 AI 及代码托管平台。\\n- **无设备数限制**：全系不限制在线设备数，非常适合家庭成员共享或极客多设备的开发场景。\\n\\n**优惠说明**：\\n常驻优惠 **yxr888** 依然有效（常规四款套餐均可使用）。\\n当前正值限时活动（有效期至 `2026-10-10`）：\\n- 年付周期（包含星耀风暴套餐）可使用 **moon80** 享 8折。\\n- 月付、季付、半年付（包含王者定制版）可使用 **moon85** 享 85折。\\n*注意：三款一次性不限时流量包（160GB、420GB、1000GB）均不参与任何优惠折扣。*';

let start = c.indexOf('const markdownContent');
c = c.substring(0, start) + 'const markdownContent = ' + JSON.stringify(text) + ';\\n\\nconst output = matter.stringify(markdownContent, brandContent);\\nfs.writeFileSync("src/content/brands/invisible.md", output, "utf8");\\nconsole.log("Updated invisible.md");';
fs.writeFileSync('update_invisible.cjs', c);
