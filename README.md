<div align="center">

<img src="docs/assets/hero.webp" alt="桃白簪花 · 中式动漫主视觉" width="100%">

# 桃白簪花 · mihomo

*以中国桃花与白桃为印，收存山河、人物与相守心事。*

[![内核](https://img.shields.io/badge/内核-mihomo%20%2F%20Clash%20Meta-8A2BE2?style=flat-square)](https://github.com/MetaCubeX/mihomo)
[![类型](https://img.shields.io/badge/类型-覆写脚本%20Script-CC6699?style=flat-square)](#-使用方法)
[![风格](https://img.shields.io/badge/风格-中式动漫%20%2F%20长卷-C49A51?style=flat-square)](#-策略组卷名对照)
[![上游](https://img.shields.io/badge/上游-AIsouler%2FMyClash-AD493B?style=flat-square)](https://github.com/AIsouler/MyClash)
[![License](https://img.shields.io/badge/协议-MIT-3DA639?style=flat-square)](#-开源协议)

**📎 [在线长卷（含动效）](docs/index.html)** · [脚本直链](#-使用方法) · [上报问题](https://github.com/JokerXiaoMo/taobai-zanhua/issues)

</div>

---

## 📖 简介

**「桃白簪花」** 是一份面向 [mihomo](https://github.com/MetaCubeX/mihomo)（Clash Meta）内核的**配置覆写脚本**：

> 将机场订阅覆写为一套**长卷式命名**的完整策略组体系，并针对「**超稳定、超低延迟访问各个 APP**」做了四项增强。

**它能做什么**

- 🍑 覆写后，所有策略组以「卷名」命名（对照见下表），面板如一幅缓缓展开的长卷
- 🔁 订阅更新后重新覆写即可，地区组、倍率组、分流组**全部自动生成**，无需手动维护
- 🩹 自动处理机场私有 DNS / hosts 映射导致的节点解析问题，**DNS 无泄露**
- 🎛 顶部 `ruleOptionsEnable` 提供全部开关，注释齐全，想改就改

> 🙏 **本项目基于 [AIsouler/MyClash](https://github.com/AIsouler/MyClash) 的 `mihomoScript.js` 微改而来**——分流逻辑、规则集与节点处理均出自原作者之手，在此致以诚挚谢意。本版在其基础上做了**长卷式命名重塑**与**连接稳定性增强**，并重新设计了文档与项目结构。

---

## 🌟 四项增强（面向超稳定、超低延迟）

| # | 增强 | 效果 |
| :-: | :--- | :--- |
| 1 | **sniffer 域名嗅探** | TLS/HTTP 域名嗅探，分流更精准；QUIC 被拦截时自动回落 TCP，视频 / 语音不断流 |
| 2 | **`global-client-fingerprint: chrome`** | 统一 TLS 指纹，降低 CDN 风控拦截概率，连接更稳 |
| 3 | **`keep-alive-interval` 30s + `tcp-keep-alive-idle` 30s** | 空闲保活，NAT 映射不易失效，减少重连与延迟抖动 |
| 4 | **「🌸 寻花」自动组 · 50ms 容差 url-test** | 实时测速、始终自动切换最低延迟线路 |

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

> 净泉引用的规则集全部为 `domain` 行为（`private / fakeip_filter / geolocation-cn / cn / games_cn / epicgames / nvidia_cn / apple_cn / microsoft_cn`，灵鸽·传讯开启时再加 `googlefcm`），与内核 rule 模式要求一致；关掉开关即回退旧黑名单写法，兼容老内核。

此外完整继承了原脚本的招牌能力：

- 🔄 根据节点名称**动态生成地区策略组**（自动补全国旗、剔除信息节点）
- ⚖️ 自动识别**低倍率 / 高倍率**节点并归类
- 🩹 自动解决机场**私有 DNS / hosts 映射**导致的节点域名解析问题（hosts 改写进节点 server），DNS 无泄露
- 🧩 支持**自定义节点**（自动生成「🪶 本命·自建」组）与**链式代理**（自定义节点作落地、经「🌉 合道·中转」中转）
- 🚫 可选屏蔽国外 QUIC、过滤高倍率 / 非地区节点、IPv4 / IPv6 优先

---

## 🗂 命名体系

命名取自站点意象——**桃花、白桃、长卷、簪花、五灵守卷**。四层结构，层层展开：

### 卷首 · 桃印起卷

| 原名 | 卷名 | 卷意 |
| :--- | :--- | :--- |
| 默认代理 | **🍑 桃印 \| 总卷** | 万流归卷，一切由此起笔 |
| 手动选择 | **🖐️ 拾印 \| 手动** | 按心而择，一枚印鉴亲手盖下 |
| 自动选择 | **🌸 寻花 \| 自动** | 循花瓣最轻的落处，自动择路 |
| 负载均衡 | **🍃 分花 \| 均衡** | 分花同承，负荷不偏倚 |

### 卷二 · 行止（三条去路）

| 原名 | 卷名 | 卷意 |
| :--- | :--- | :--- |
| 直连 | **🏠 归檐 \| 直连** | 乡音不远行，家门之内直去直回 |
| 广告拦截 | **🚫 掩扉 \| 拦截** | 帘外不迎，广告与骚扰止于门前 |
| 漏网之鱼 | **🌙 拾遗 \| 兜底** | 漏尽处皆有所归，未有遗落 |

### 卷三 · 山河（五灵守卷，各镇一方）

| 地区 | 卷名 | | 类型 | 卷名 |
| :--- | :--- | :-: | :--- | :--- |
| 中国香港 | **🏮 灯 \| 香江** | | 低倍率节点 | **⚖️ 轻羽·低倍** |
| 中国澳门 | **🗺️ 濠镜** | | 高倍率节点 | **🔥 重岳·高倍** |
| 日本 | **🖌️ 砚 \| 东瀛** | | 其他节点 | **🪶 散修·散点** |
| 美国 | **☁️ 羽 \| 花旗** | | 自建节点 | **🪶 本命·自建** |
| 新加坡 | **🧣 绫 \| 狮城** | | 链式中转 | **🌉 合道·中转** |
| 中国台湾 | **📜 卷 \| 宝岛** | | 链式落地 | **🌉 合道·落地** |

### 卷四 · 分卷（十余项服务，各归其卷）

| 服务 | 卷名 | | 服务 | 卷名 |
| :--- | :--- | :-: | :--- | :--- |
| Google FCM | **💬 灵鸽·传讯** | | Telegram | **✈️ 飞书·电报** |
| YouTube | **🎬 映画·油管** | | Steam | **🎮 雾阁·蒸汽** |
| Google | **🗺️ 星图·谷歌** | | TikTok | **🎵 幻音·短影** |
| 国外 AI | **🤖 天工·灵智** | | Twitter | **🕊️ 栖鸾·推特** |
| Meta | **📘 墨册·脸书** | | Line | **💚 青笺·连线** |
| Microsoft | **🪟 云笈·微软** | | Apple | **🍎 玉果·苹果** |
| Netflix | **🎞️ 映雪·奈飞** | | Emby | **📚 藏经阁·影库** |
| PikPak | **🎒 行囊·网盘** | | Spotify | **🎧 韶音·声乐** |
| 加密货币 | **🪙 通宝·加密** | | E-Hentai | **🔖 秘阁·E站** |
| 广告拦截 | **🚫 掩扉 \| 拦截** | | | |

> `GLOBAL` 保持不变，以兼容面板全局模式。

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
4. 重新激活订阅，即可看到全套卷名策略组

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
| `生成地区自动选择组` | 每个地区附带一个 `·寻花` url-test 自动组 |
| `隐藏地区手动选择组` | 面板中隐藏地区手动选择组，只留自动组 |
| `生成倍率组` | 生成「⚖️ 轻羽·低倍 / 🔥 重岳·高倍」分组 |
| `过滤低倍率节点` / `过滤高倍率节点` / `过滤非地区节点` | 节点过滤 |
| `屏蔽国外QUIC` | 屏蔽国外 UDP 443（QUIC），配合 sniffer 自动回落 TCP |
| `代理IPV4优先` / `代理IPV6优先` | 节点 IP 栈偏好（二者只开一个） |
| `链式代理` | 自定义节点作为落地，经「🌉 合道·中转」中转 |
| `御风栈启用mips` | 🌬️ 御风之本：TUN 用 mips 栈；关闭回退 `mixed`（老内核兜底） |
| `御风栈整运` / `御风栈让路` / `御风栈纳新` | 🌬️ 御风三式（MTU+GSO / 私网不过栈 / EIM 全锥），详见上文 |
| `净泉真假分明` | fake-ip 规则化：直连域名 real-ip、其余 fake-ip；关闭回退旧写法 |
| 各分流组（`🎬 映画·油管` 等） | 关闭后该策略组与对应规则整体移除 |

---

## 📁 目录结构

```
taobai-zanhua
├── Script/
│   └── taobai-zanhua.js    # 覆写脚本本体（桃白簪花）
├── docs/
│   ├── index.html          # 在线长卷（含动效）
│   └── assets/
│       └── hero.webp       # 主视觉背景图
├── README.md
└── LICENSE
```

> 想看动效版长卷？开启 GitHub Pages：**Settings → Pages → Source 选 `Deploy from a branch` → Branch 选 `main`、目录选 `/docs`**（⚠️ 必须选 `/docs`，选 `/(root)` 会 404，因为 `index.html` 在 docs 里）。
> 保存后等 1~2 分钟构建即可访问 `https://jokerxiaomo.github.io/taobai-zanhua/`；本地直接双击 `docs/index.html` 也行。

---

## 🔄 上游同步记录

已同步 [AIsouler/MyClash](https://github.com/AIsouler/MyClash) 全量版 `mihomoScript.js` 从 `9560c72` 到 `35c646e` 的 **11 笔**提交：

| 提交 | 说明 |
| :--- | :--- |
| `1ec8f4e` | 优化倍率节点匹配 |
| `07315d8` | 更换直连策略组 icon |
| `1874f3c` | 支持自定义是否过滤低倍率节点 |
| `e1d2939` | 调整 DNS 配置 |
| `7af9730` | 优化倍率节点匹配 |
| `b86bb36` | global exclude filter（补充 `过滤` 排除词） |
| `8e6fcef` | `steam_asn` 更换为 `steam_ip` |
| `27c8918` | 新增 `tiktok_ip`、`spotify_ip` 规则集 |
| `1adfe48` | 特定条件下合并节点域名策略（新增 `simplifyDomainPolicy`） |
| `e2696c8` | 调整规则 |
| `35c646e` | 优化 |

同步原则：**分流逻辑、规则集、DNS 处理全部跟随上游**；仅策略组 / 地区命名保留桃白簪花卷名，四项增强（`sniffer`、`global-client-fingerprint`、30s 保活、「🌸 寻花」50ms 容差）保持不变。

### 最近一次同步：`9c01b6e` → `9b9f2cc`（4 笔）

| 提交 | 说明 | 桃白簪花落地 |
| :--- | :--- | :--- |
| `18e40e1` | feat: 新增 Meta、Line 策略组 | 「📸 绘镜·影格」升级为 **「📘 墨册·脸书」**：规则集由 `instagram` 换成 `meta`（`facebook` 域名集），并补一个 `facebook_ip`（ipcidr，带 `no-resolve`），域名 + IP 双覆盖；同时新增 **「💚 青笺·连线」**（`line` 域名集）。开关、组名、规则目标三处命名已一起改名，`ruleOptionsEnable` 键名同步，避免上游「改名键失配 → 静默失效」的老坑 |
| `44ce58e` | perf: 优化DNS配置 | `chinaDNS` 去掉首位的 `'system'`，回到「阿里 + 腾讯」两个国内 DNS；`direct-nameserver` / `nameserver-policy['rule-set:cn']` 随之生效 |
| `be02e39` | feat: EHentai 增加 `直连` 选项 #42 | 「🔖 秘阁·E站」加上 `direct: true`，成员表补入「🏠 归檐 \| 直连」，方便把 E 站直接走本地网络（默认仍指向「☁️ 羽 \| 花旗」） |
| `9b9f2cc` | fix: dns | `defaultDNS` 第三条由 `https://1.12.12.12#DIRECT` 修正为 `https://1.12.12.12/dns-query#DIRECT` —— 补上 DoH 路径，此前会被当成普通 443 请求 |

> 本轮 `mihomoScript.js` 净增量 `+32 -10`，与上游 diff 逐行一致。上游同批次还改了 `Config/*.yaml`、`Image/*` 与它自己的 README，本仓库不提供这些文件，故未同步。

### 上一次同步：`40f932d` → `9c01b6e`（2 笔）

| 提交 | 说明 | 桃白簪花落地 |
| :--- | :--- | :--- |
| `7444d83` | perf: 优化DNS配置 | ① 拆掉旧常量 `chinaDohDNS`，改为 `defaultDNS` / `proxyServerDNS` 两条独立列表，`default-nameserver`（启动引导）与 `proxy-server-nameserver`（解析节点域名）不再共用同一组上游；② 引导解析用 `114.114.114.114` 明文 + `tls://223.5.5.5` + `1.12.12.12` DoH，代理服务端解析用 `114.114.114.114` + `tls://223.5.5.5` + `doh.pub` DoH；③ `hosts` 补上 `doh.pub` 映射（`1.12.12.12` / `120.53.53.53`），省一次自举递归；④ `nameserver`（`🍑 桃印 \| 总卷`）与 `nameserver-policy` 保持原样 |
| `9c01b6e` | feat: tun.stack 更换为 mips | TUN 栈由 `system` 换成 `mips`：纯用户态转发、不依赖系统内核栈，跨平台行为更一致，转发路径更短更省电 |

### 再上一次同步：`001faf2` → `40f932d`（1 笔）

| 提交 | 说明 | 桃白簪花落地 |
| :--- | :--- | :--- |
| `40f932d` | perf: 优化DNS配置 | ① `chinaDNS` 首位加入 `system`（系统 DNS 兜底），`direct-nameserver` 直接复用之；② `chinaDohDNS` 新增 `114.114.114.114` DoH；③ 公共 DNS 过滤清单新增 `dns.apple`、`one.one.one.one` 关键词，订阅节点里这类公共 DNS 节点过滤更干净 |

### 更早一次同步：`fefcb66` → `001faf2`（2 笔）

| 提交 | 说明 | 桃白簪花落地 |
| :--- | :--- | :--- |
| `188ceec` | feat: add microsoft_ip、apple_ip | 「🪟 云笈·微软」「🍎 玉果·苹果」新增 GeoIP 规则集与 `no-resolve` 规则：域名与 IP 双覆盖，命中更彻底 |
| `001faf2` | perf: 优化配置检查 | `main()` 入口新增校验：配置中若带 `proxy-providers` 直接报错并提示改用机场原始配置覆写，避免产出无效配置 |

### 最早一次同步：`35c646e` → `fefcb66`（4 笔）

| 提交 | 说明 | 桃白簪花落地 |
| :--- | :--- | :--- |
| `0d82dc3` | 优化倍率节点匹配 | 倍率正则前置符新增 `[`、`(`，后置符新增 `)`、`]`，`[0倍]`、`(2倍)` 这类带括号的节点名现在能正确归池 |
| `95e9b27` | 优化简写节点域名策略处理，避免误匹配 | `simplifyDomainPolicy` 增加守卫：仅当策略域名集合与节点域名集合完全一致时才简写，否则原样输出 |
| `3466ca3` | 将 googlefcm 添加到 fake-ip-filter | 「💬 灵鸽·传讯」开关开启时，`rule-set:googlefcm` 会进入 `fake-ip-filter`，避免 FCM 推送被 fake-ip 干扰 |
| `fefcb66` | docs: add Star History | README 文档改动，本仓库自行维护文档，未同步 |

> ⚠️ 本次同步踩到一个「上游键名 vs 本版键名」的坑：上游新增代码写的是 `ruleOptionsEnable['FCM']`，而本版把该开关改名为 `💬 灵鸽·传讯`，直接照搬会导致新功能**静默失效**。已改为 `ruleOptionsEnable['💬 灵鸽·传讯']`，并加了专项测试守护。

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

- [Koolson/Qure](https://github.com/Koolson/Qure) —— **主要图标来源**（引用 34 处）
- [MiToverG422/Qure](https://github.com/MiToverG422/Qure) —— 补充 FCM 图标（1 处）
- [lige47/QuanX-icon-rule](https://github.com/lige47/QuanX-icon-rule) —— 补充 Meta / PikPak / 加密货币 / E-Hentai 图标（4 处）

**🖥 面板**

- [Zephyruso/zashboard](https://github.com/Zephyruso/zashboard) —— 控制面板

**🌐 DNS 服务**

- 阿里 DNS（`223.5.5.5` 明文 / `tls://223.5.5.5`）· 腾讯 DNSPod（`119.29.29.29` / `1.12.12.12` DoH / [`doh.pub`](https://www.dnspod.cn/products/publicdns) DoH）· [114DNS](https://www.114dns.cn)（`114.114.114.114`）· [Cloudflare DNS](https://1.1.1.1) · [Google DNS](https://dns.google)

<details>
<summary>🔍 核对说明：本次调整了什么</summary>

| 项目 | 动作 | 原因 |
| :--- | :--- | :--- |
| `lige47/QuanX-icon-rule` | ➕ 新增 | 脚本实际引用 4 处图标，此前遗漏 |
| `MiToverG422/Qure` | ➕ 新增 | 脚本实际引用 1 处 FCM 图标，此前遗漏 |
| `wwqgtxx/clash-rules` | ➖ 移除 | 当前脚本已无任何引用（上游 `a87f98a` 移除了相关规则） |
| `217heidai/AdBlockFilters` | ✏️ 更名 | 实际仓库名为小写 `217heidai/adblockfilters` |
| DNS 服务商 | ➕ 新增 | 脚本默认 DNS 上游，此前未列 |
| `doh.pub` | ➕ 新增 | 上游 `7444d83` 引入的腾讯 DoH，脚本已为其补 `hosts` 映射（`1.12.12.12` / `120.53.53.53`） |

</details>

---

## ⚠️ 免责声明

本项目仅供学习与研究网络技术使用，不提供任何节点 / 订阅，也不承载任何流量。请遵守所在地区的法律法规，合理使用代理工具。

## 📜 开源协议

本项目文档与项目结构以 [MIT](LICENSE) 协议开源。

覆写脚本 `Script/taobai-zanhua.js` 为 [AIsouler/MyClash](https://github.com/AIsouler/MyClash)（未附带开源协议）之 `mihomoScript.js` 的修改版本，其著作权归属原作者 AIsouler；本项目在使用处均已显著标注来源。若原作者提出异议，将第一时间处理。

---

<div align="center">

**若桃白簪花为你簪过一枝春色，欢迎点一个 ⭐ Star，也请记得给 [AIsouler/MyClash](https://github.com/AIsouler/MyClash) 点一个**

*簪花一树，与君同行。*

</div>
