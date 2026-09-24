<div align="center">

<img src="docs/assets/hero.webp" alt="桃白簪花 · 中式水墨长卷主视觉" width="100%">

# 桃白簪花 · mihomo

*以中国桃花与白桃为印，收存山河、人物与相守心事。*

[![内核](https://img.shields.io/badge/内核-mihomo%20%2F%20Clash%20Meta-8A2BE2?style=flat-square)](https://github.com/MetaCubeX/mihomo)
[![类型](https://img.shields.io/badge/类型-覆写脚本%20Script-CC6699?style=flat-square)](#-使用方法)
[![风格](https://img.shields.io/badge/风格-中式水墨%20·%20簪花印-C49A51?style=flat-square)](#-命名体系)
[![图标](https://img.shields.io/badge/图标-自研簪花印%2038%20枚-E58BA8?style=flat-square)](#-图标体系)
[![上游](https://img.shields.io/badge/上游-AIsouler%2FMyClash-AD493B?style=flat-square)](https://github.com/AIsouler/MyClash)
[![License](https://img.shields.io/badge/协议-MIT-3DA639?style=flat-square)](#-开源协议)

**📎 [在线长卷（含动效）](docs/index.html)** · [脚本直链](#-使用方法) · [上报问题](https://github.com/JokerXiaoMo/taobai-zanhua/issues)

</div>

---

## 📖 简介

**「桃白簪花」** 是一份面向 [mihomo](https://github.com/MetaCubeX/mihomo)（Clash Meta）内核的**配置覆写脚本**：

> 将机场订阅覆写为一套**命名清晰、开箱即用**的完整策略组体系，并针对「**超稳定、超低延迟访问各个 APP**」做了四项增强。

**它能做什么**

- 🍑 覆写后，策略组一律采用**标准功能名 / 标准服务名**（如「🇯🇵 日本」「YouTube」「兜底」），面板一眼可懂，不再靠意象猜谜
- 🔁 订阅更新后重新覆写即可，地区组、倍率组、分流组**全部自动生成**，无需手动维护
- 🩹 自动处理机场私有 DNS / hosts 映射导致的节点解析问题，**DNS 无泄露**
- 🎨 全套策略组图标为自研「**簪花印**」体系（39 枚 SVG，存于本仓库 `Icons/`），桃粉底白符，与主题一色
- 🎛 顶部 `ruleOptionsEnable` 提供全部开关，注释齐全，想改就改

> 🙏 **本项目基于 [AIsouler/MyClash](https://github.com/AIsouler/MyClash) 的 `mihomoScript.js` 微改而来**——分流逻辑、规则集与节点处理均出自原作者之手，在此致以诚挚谢意。本版在其基础上做了**命名重塑**与**连接稳定性增强**，并重新设计了图标、文档与项目结构。

---

## 🌟 四项增强（面向超稳定、超低延迟）

| # | 增强 | 效果 |
| :-: | :--- | :--- |
| 1 | **sniffer 域名嗅探** | TLS/HTTP 域名嗅探，分流更精准；QUIC 被拦截时自动回落 TCP，视频 / 语音不断流 |
| 2 | **`global-client-fingerprint: chrome`** | 统一 TLS 指纹，降低 CDN 风控拦截概率，连接更稳 |
| 3 | **`keep-alive-interval` 30s + `tcp-keep-alive-idle` 30s** | 空闲保活，NAT 映射不易失效，减少重连与延迟抖动 |
| 4 | **「自动选择」组 · 50ms 容差 url-test** | 实时测速、始终自动切换最低延迟线路 |

## 🌬️ 御风栈 · mips 深度优化（2026-09 原创组合）

`stack: mips` 用的是 mihomo 自研的**纯 Go 用户态 IP 栈（mipstack）**——字节级 DRR 出站调度，短 UDP/ICMP 不会被 TCP 大包堵在队尾。「御风栈」在此之上再做三式一泉，全部围绕**「让用户态栈每包更值、进栈流量更少」**：

| 式 | 内容 | 效果 | 开关（默认） |
| :-: | :--- | :--- | :--- |
| **御风之本** | `stack: mips` | mihomo 自研栈（约 v1.19.31+）；老内核 TUN 起不来时关闭即回退官方推荐的 `mixed` | `御风栈启用mips`（开） |
| **一式·整运** | `mtu: 9000` + `gso` 64K | 大件整运：包越大，每字节穿越用户态栈的固定开销越低（GSO 仅 Linux 系内核生效，Windows 自动忽略）—— **原创** | `御风栈整运`（开） |
| **二式·让路** | `route-exclude-address` 7 段 + `disable-icmp-forwarding` | 家门之内不入栈：私网 / 链路本地 / 组播直接绕行（`/1` 全局路由默认会把它们扫进栈），局域网互访不排队；ICMP 本地即答 —— 路由绕行**原创**，ICMP 参考 echs-top/proxy | `御风栈让路`（开） |
| **三式·纳新** | `endpoint-independent-nat`（EIM 全锥 NAT） | 游戏 / 语音 / WebRTC 的 P2P 穿透更顺（官方注明性能略降、非必要不启）—— 参考 echs-top/proxy 并开关化 | `御风栈纳新`（关） |
| **净泉·真假分明** | `fake-ip-filter-mode: rule` | 直连域名取**真水**（real-ip：真实解析、TTL 正常、CDN 就近），其余域名皆**镜花**（fake-ip：秒回、免污染）；订阅自带的 fake-ip-filter 条目自动转换为规则语法 —— 思路参考 echs-top/proxy，规则集映射与转换器**原创** | `净泉真假分明`（开） |

另有常备 `udp-timeout: 600`：UDP 会话保鲜 10 分钟（默认 300s），QUIC / 语音长会话不易断流。

**看得见的组：「QUIC 断流闸」**——御风栈的五式大多是 TUN/DNS 底层配置（不产生策略组），唯独国外 QUIC 断流是路由可控的，特意做成**紧跟主控的可见策略组**，面板里随时切三档：

| 档位 | 含义 |
| :--- | :--- |
| `REJECT`（默认） | 拦截国外 QUIC，配合嗅探自动回落 TCP，视频/语音更稳 |
| `PASS-RULE` | 放行，交给后续规则正常分流（等价旧版「屏蔽国外QUIC=false」） |
| `直连` | 国外 QUIC 全部直连 |

`屏蔽国外QUIC` 开关现在只决定**初始默认档**（true=REJECT / false=PASS-RULE），面板改动会被 `store-selected` 记住；同时 sniffer 补上了 QUIC 端口嗅探，放行档也能按域名精准分流。

> 净泉引用的规则集全部为 `domain` 行为（`private / fakeip_filter / geolocation-cn / cn / games_cn / epicgames / nvidia_cn / apple_cn / microsoft_cn`，Google FCM 开启时再加 `googlefcm`），与内核 rule 模式要求一致；关掉开关即回退旧黑名单写法，兼容老内核。

此外完整继承了原脚本的招牌能力：

- 🔄 根据节点名称**动态生成地区策略组**（自动补全国旗、剔除信息节点）
- ⚖️ 自动识别**低倍率 / 高倍率**节点并归类
- 🩹 自动解决机场**私有 DNS / hosts 映射**导致的节点域名解析问题（hosts 改写进节点 server），DNS 无泄露
- 🧩 支持**自定义节点**（自动生成「自建节点」组）与**链式代理**（自定义节点作落地、经「链式中转」中转）
- 🚫 可选屏蔽国外 QUIC、过滤高倍率 / 非地区节点、IPv4 / IPv6 优先

---

## 🗂 命名体系

2026-09 起命名**重做**：组名 = **标准功能名 / 标准服务名**，不猜谜。
「桃白簪花」的主题不再靠堆砌意象，而落在三处——**主控组名**、**三卷分类**、**自研图标**。

### 一、主控 · 品牌锚点

| 组名 | 说明 |
| :--- | :--- |
| **桃白簪花 · 主控** | 全局唯一出口，万流归卷；`MATCH` 兜底亦落于此（极简模式下为唯一出口） |

### 二、基础三组

| 组名 | 说明 |
| :--- | :--- |
| **手动选择** | 按心而择，一枚印鉴亲手盖下 |
| **自动选择** | 50ms 容差 url-test，实时测速、始终走最轻的落处 |
| **负载均衡** | 分花同承，负荷不偏倚 |

### 三、去路四组

| 组名 | 说明 |
| :--- | :--- |
| **直连** | 乡音不远行，家门之内直去直回 |
| **广告拦截** | 帘外不迎，广告与骚扰止于门前 |
| **兜底** | 漏尽处皆有所归，未有遗落（`MATCH` 落点） |
| **QUIC 断流闸** | QUIC 急流一道闸，或截或放一目了然（御风栈唯一可见组，面板可实时切档） |

### 四、山河 · 地区组

| 组名 | 图标 | 组名 | 图标 |
| :--- | :--- | :--- | :--- |
| **🇨🇳 中国香港** | `hk.svg` | **🇯🇵 日本** | `jp.svg` |
| **🇨🇳 中国澳门** | `mo.svg` | **🇺🇸 美国** | `us.svg` |
| **🇨🇳 中国台湾** | `tw.svg` | **🇸🇬 新加坡** | `sg.svg` |

每个地区可附带一个自动选择子组（如 `🇯🇵 日本 · 自动`），由开关 `生成地区自动选择组` 控制。

> 港澳台统一带「中国」前缀，图标同为**五星红旗**；日、美、新三国按各自真实国旗绘制（新加坡为红白横幅 + 白色月牙与五星星环）。

### 五、倍率 · 自建组

| 组名 | 说明 |
| :--- | :--- |
| **低倍率节点** | 自动识别低倍率节点并归池 |
| **高倍率节点** | 自动识别高倍率节点并归池 |
| **其他节点** | 未匹配到任何地区的节点 |
| **自建节点** | 由 `customizeProxies` 定义；**启用链式代理时该组自动更名为「链式落地」** |
| **链式中转** | 链式代理的中转组（自定义节点的 `dialer-proxy` 指向它） |

### 六、分卷 · 服务组

服务组按站点（[fanxiaofei.ccwu.cc](http://fanxiaofei.ccwu.cc/)）三栏目分类，各归其卷：

**📜 桃花笺 · 文字与社交**

| 服务 | 组名 | 图标 |
| :--- | :--- | :--- |
| Google FCM | **Google FCM** | `fcm.svg` |
| Google | **Google** | `google.svg` |
| Twitter | **Twitter** | `twitter.svg` |
| Meta | **Meta** | `meta.svg` |
| Telegram | **Telegram** | `telegram.svg` |
| LINE | **LINE** | `line.svg` |

**📚 拾遗录 · 工具与服务**

| 服务 | 组名 | 图标 |
| :--- | :--- | :--- |
| Microsoft | **Microsoft** | `microsoft.svg` |
| Apple | **Apple** | `apple.svg` |
| 国外 AI | **AI 服务** | `ai.svg` |
| PikPak | **PikPak** | `pikpak.svg` |
| 加密货币 | **加密货币** | `crypto.svg` |
| PayPal | **PayPal** | `paypal.svg` |
| E-Hentai | **E-Hentai** | `ehentai.svg` |
| 广告拦截 | **广告拦截** | `adblock.svg` |

**🎞 观照集 · 影音与图像**

| 服务 | 组名 | 图标 |
| :--- | :--- | :--- |
| YouTube | **YouTube** | `youtube.svg` |
| Netflix | **Netflix** | `netflix.svg` |
| Emby | **Emby** | `emby.svg` |
| Spotify | **Spotify** | `spotify.svg` |
| TikTok | **TikTok** | `tiktok.svg` |
| Steam | **Steam** | `steam.svg` |

> `GLOBAL` 保持不变，以兼容面板全局模式。

---

## 🎨 图标体系

全套策略组图标为**本项目自研**（「簪花印」体系），不再引用任何第三方图标集：

| 项目 | 规格 |
| :--- | :--- |
| 尺寸 | 48 × 48，圆角 13 |
| 底 | 桃粉渐变 `#F0A8C0` → `#E58BA8`，外描边 `#E58BA8` |
| 符 | 白色简笔符号，一眼可辨 |
| 数量 | 39 枚 SVG，全部存放于本仓库 [`Icons/`](Icons) |

- **地区图标**：严格按真实国旗绘制——港澳台统一**五星红旗**；日本日章旗、美国星条旗、新加坡星月旗
- **服务图标**：按各品牌 / 站点的**识别图形**绘制（粉底白符），如 YouTube 播放框、Spotify 三道声弧、Telegram 纸飞机、Steam 曲柄阀

脚本中 45 处图标引用**全部指向本仓库**，经 jsDelivr 分发：

```
https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Icons/youtube.svg
```

> 想换自己的图标？把 SVG 传进你的仓库，替换 `Icons/` 前缀即可——脚本中所有图标都是完整 URL，搜 `Icons/` 一览无余。

---

## 🚀 使用方法

### 一键 Raw 直链（推荐，方便后续同步更新）

脚本直链，可直接在支持「链接覆写 / 远程脚本」的客户端中填入：

```
https://raw.githubusercontent.com/JokerXiaoMo/taobai-zanhua/main/Script/taobai-zanhua.js
```

> 若 `raw.githubusercontent.com` 无法直连，可改用加速前缀：
> ```
> https://fastly.jsdelivr.net/gh/JokerXiaoMo/taobai-zanhua@main/Script/taobai-zanhua.js
> ```

### Clash Verge Rev（覆写方式）

1. 订阅列表 → 右键你的机场订阅 → **编辑脚本**（或 全局扩展配置 → Script）
2. 粘贴 [`Script/taobai-zanhua.js`](Script/taobai-zanhua.js) 全文保存
3. **关闭客户端自带的 DNS 覆写**（设置 → DNS 覆写关闭），交给脚本接管
4. 重新激活订阅，即可看到全套策略组

### Mihomo Party / 其他 Script 覆写客户端

同上：在「覆写 / Override → JavaScript」中粘贴脚本全文，保存并启用即可。

### Bettbox（原生适配）

脚本内置 `Compatible_With_Bettbox`，Bettbox 可直接识别脚本中的自定义配置选项，图形化开关各项功能。

### ⚠️ 注意事项

- 仅用于**机场提供的订阅配置文件**进行覆写，勿用于自行编写的配置
- 需**关闭代理软件自带的 DNS 覆写功能**，避免与脚本生成的 DNS 配置冲突
- 想修改开关 / 添加自定义节点？直接编辑脚本顶部「静态配置区域」，注释齐全

---

## 🎛 自定义开关速览

脚本顶部的 `ruleOptionsEnable` 提供全部开关（`true` 启用 / `false` 禁用），常用项：

| 开关 | 说明 |
| :--- | :--- |
| `极简模式` | 不生成地区组 / 倍率组 / 分流组，仅保留「桃白簪花 · 主控」出口，`MATCH` 走主控 |
| `生成地区自动选择组` | 每个地区附带一个 `地区 · 自动` url-test 子组 |
| `隐藏地区手动选择组` | 面板中隐藏地区手动选择组，只留自动组 |
| `生成倍率组` | 生成「低倍率节点 / 高倍率节点」分组 |
| `分流组添加所有节点` | 是否为各分流策略组添加所有节点 |
| `过滤低倍率节点` / `过滤高倍率节点` / `过滤非地区节点` | 节点过滤 |
| `屏蔽国外QUIC` | 「QUIC 断流闸」的初始默认档：true=REJECT 拦截 / false=PASS-RULE 放行（面板可随时切档） |
| `代理IPV4优先` / `代理IPV6优先` | 节点 IP 栈偏好（二者只开一个） |
| `链式代理` | 自定义节点作为落地，经「链式中转」中转（组名同时变为「链式落地」） |
| `御风栈启用mips` | 🌬️ 御风之本：TUN 用 mips 栈；关闭回退 `mixed`（老内核兜底） |
| `御风栈整运` / `御风栈让路` / `御风栈纳新` | 🌬️ 御风三式（MTU+GSO / 私网不过栈 / EIM 全锥），详见上文 |
| `净泉真假分明` | fake-ip 规则化：直连域名 real-ip、其余 fake-ip；关闭回退旧写法 |
| 各分流组（`YouTube`、`Google FCM` 等 20 项） | 关闭后该策略组与对应规则整体移除 |

---

## 📁 目录结构

```
taobai-zanhua
├── Script/
│   └── taobai-zanhua.js    # 覆写脚本本体（桃白簪花）
├── Icons/                  # 自研「簪花印」图标（39 枚 SVG）
├── docs/
│   ├── index.html          # 在线长卷（含动效）
│   └── assets/
│       └── hero.webp       # 主视觉背景图（中式水墨长卷）
├── README.md
└── LICENSE
```

> 想看动效版长卷？开启 GitHub Pages：**Settings → Pages → Source 选 `Deploy from a branch` → Branch 选 `main`、目录选 `/docs`**（⚠️ 必须选 `/docs`，选 `/(root)` 会 404，因为 `index.html` 在 docs 里）。
> 保存后等 1~2 分钟构建即可访问 `https://jokerxiaomo.github.io/taobai-zanhua/`；本地直接双击 `docs/index.html` 也行。

---

## 🙏 致谢

> 以下名单**逐项核对过脚本内的实际引用**（引用次数以当前版本 `Script/taobai-zanhua.js` 为准），排名分先后、诚意不分先后。

**⭐ 原脚本作者**

- **[AIsouler/MyClash](https://github.com/AIsouler/MyClash)** —— 本项目的根基。覆写脚本基于其 `mihomoScript.js` 微改而来：节点过滤与地区归组、机场私有 DNS / hosts 修复、倍率识别、链式代理等核心能力均出自原作者之手，桃白簪花不过是在巨人的肩上簪了一枝花。**强烈建议去给原项目点一个 Star。**

**🧠 内核与客户端**

- [MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo) —— 强大的代理内核
- [appshubcc/Bettbox](https://github.com/appshubcc/Bettbox) —— 好用、省电且内存占用低的代理软件（友情推荐，脚本原生适配其图形化配置）

**🌬️ 思路参考**

- [echs-top/proxy](https://github.com/echs-top/proxy) —— 「御风栈」部分手法（UDP 保鲜 600s、ICMP 本地即答、EIM 全锥、fake-ip 规则化）的灵感来源；其规则化 DNS 分流的思路值得一看。御风栈的 MTU/GSO 整运、私网路由绕行、开关化与订阅条目转换器为本项目原创

**📜 规则集**

- [appshubcc/bett-rules](https://github.com/appshubcc/bett-rules) —— **主要规则集来源**（引用 40 处）
- [666OS/rules](https://github.com/666OS/rules) —— Emby 域名规则（1 处）
- [binaryu/emos-proxy-rule](https://github.com/binaryu/emos-proxy-rule) —— Emby 规则补充（1 处）
- [217heidai/adblockfilters](https://github.com/217heidai/adblockfilters) —— 广告过滤规则（1 处）
- `cn-additional-list` 国内补充规则 —— 来自 `static-file-global.353355.xyz`（1 处）

**🎨 策略组图标**

- **本项目自研**「簪花印」图标体系（39 枚 SVG，见 [`Icons/`](Icons)）：桃粉渐变底 + 白色简笔符号；地区图标按真实国旗绘制，服务图标按各品牌识别图形绘制。早期版本曾引用 [Koolson/Qure](https://github.com/Koolson/Qure)、[MiToverG422/Qure](https://github.com/MiToverG422/Qure)、[lige47/QuanX-icon-rule](https://github.com/lige47/QuanX-icon-rule) 等图标集，现已全部替换为自研图标，在此一并致谢其启发

**🖥 面板**

- [Zephyruso/zashboard](https://github.com/Zephyruso/zashboard) —— 控制面板

**🌐 DNS 服务**

- 阿里 DNS（`223.5.5.5` 明文 / `tls://223.5.5.5`）· 腾讯 DNSPod（`119.29.29.29` / `1.12.12.12` DoH / [`doh.pub`](https://www.dnspod.cn/products/publicdns) DoH）· [114DNS](https://www.114dns.cn)（`114.114.114.114`）· [Cloudflare DNS](https://1.1.1.1) · [Google DNS](https://dns.google)

---

## ⚠️ 免责声明

本项目仅供学习与研究网络技术使用，不提供任何节点 / 订阅，也不承载任何流量。请遵守所在地区的法律法规，合理使用代理工具。

## 📜 开源协议

本项目文档、项目结构与 `Icons/` 图标以 [MIT](LICENSE) 协议开源。

覆写脚本 `Script/taobai-zanhua.js` 为 [AIsouler/MyClash](https://github.com/AIsouler/MyClash)（MIT 协议）之 `mihomoScript.js` 的修改版本，其著作权归属原作者 AIsouler；本项目在使用处均已显著标注来源。若原作者提出异议，将第一时间处理。

---

<div align="center">

**若桃白簪花为你簪过一枝春色，欢迎点一个 ⭐ Star，也请记得给 [AIsouler/MyClash](https://github.com/AIsouler/MyClash) 点一个**

*簪花一树，与君同行。*

</div>
