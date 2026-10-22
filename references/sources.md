# 一手来源与适配范围

核对日期：2026-10-08。公开网页可能更新；API 以项目目标版本为准。本包自主编写，不含 motion-web 的代码、案例资产或原文规则。公司名称用于来源说明，不表示授权或认可。

| 来源 | 链接 | 本包采用 |
|---|---|---|
| Apple HIG Motion | https://developer.apple.com/design/human-interface-guidelines/motion | 目的、简洁、可取消与舒适性 |
| Apple Designing Fluid Interfaces, WWDC18 | https://developer.apple.com/videos/play/wwdc2018/803/ | 输入响应、手势与交接 |
| Apple Animate with springs, WWDC23 | https://developer.apple.com/videos/play/wwdc2023/10158/ | 连续速度、弹簧与参数语义 |
| Apple accessibilityReduceMotion | https://developer.apple.com/documentation/swiftui/environmentvalues/accessibilityreducemotion | 原生偏好读取 |
| Google Material 3 Motion | https://m3.material.io/styles/motion | scheme、spatial/effects、physics；网页为 JS 渲染，研究时通过官方页面索引文本核对 |
| Compose Customize animations | https://developer.android.com/develop/ui/compose/animation/customize | spring、tween、改目标连续性 |
| Compose Spring | https://developer.android.com/reference/kotlin/androidx/compose/animation/core/Spring | dampingRatio 与 stiffness 定义 |
| Disney Animation: Animation | https://www.disneyanimation.com/process/animation/ | 表演与动作原则的官方概述 |
| Disney Publishing: The Illusion of Life | https://books.disney.com/book/the-illusion-of-life/ | Frank Thomas / Ollie Johnston 著作归属；未取得全文 |
| Frank & Ollie: Physical Animation | https://frankandollie.com/PhysicalAnimation.html | 12 原则的公开释义；本包只使用原则名称，产品迁移自主编写 |
| Microsoft Fluent 2 Motion | https://fluent2.microsoft.design/motion | 四原则、层级与编排 |
| IBM Carbon Motion | https://www.carbondesignsystem.com/building-blocks/foundations/motion/overview | productive / expressive 与语义一致 |
| W3C WAI 2.3.3 | https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html | 交互引起的非必要运动可关闭，AAA |
| W3C WAI 2.2.2 | https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide | 持续自动运动的暂停/停止/隐藏，A |
| MDN cubic-bezier | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/cubic-bezier | 控制点越界可产生过冲；不等于多周期物理振荡 |

本包的毫秒、omega/zeta、stagger 上限、幅度均为项目可调起点；它们没有被包装为上述公司的官方 token。

新增实现资料于 2026-10-09 核对：

- [WAI-ARIA APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)：方向键与焦点规则；没有可聚焦内容的面板提供键盘焦点。本包导航范例按此组织，不意味着其它组件自动获得完整无障碍认证。
- [MDN Animation.finished](https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished)：完成 promise 与重播生命周期。效果轨道处理取消与过期回调，语义不等待动画完成。

## 1.0合并与再核验

1.0层级修订：Apple、Material、Disney、Fluent与Carbon恢复为同地位的并列设计依据，统一阅读入口、合同与评审。以下1.0资料核对是历史记录，不表示当前仅有两项主依据。分轨、十二原则细则和原有来源继续保留，WAI统一约束全部方案。

1.0再次核对：[Material motion physics官方索引正文](https://m3.material.io/styles/motion/overview/how-it-works)的空间/效果、scheme与速度层级；页面直接打开仅返回JS占位，因此以同页搜索索引正文和[官方Material Components实现文档](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)交叉核对，不声称本次完整交互浏览成功。[Disney Animation官方页](https://www.disneyanimation.com/process/animation/)说明表演、重量、主次和节奏；十二项完整名称另由[Frank & Ollie](https://frankandollie.com/PhysicalAnimation.html)核对。两者进入必读设计依据、合同及验证；具体UI适配与全控件要求仍为本包规则。

合并用户上传motion-orchestrator-1.0：productive/expressive/narrative、原则迁移、解析弹簧与单位、平台适配；全控件覆盖、滚动进退和复合微交互是本次用户要求与自主工程规则，不冒称公司规范。2026-10-09重新读取Apple WWDC23 Animate with springs（位置/速度连续与释放交接）、Android Customize animations（spring/tween及中断）、W3C 2.3.3（非必要交互动画可关闭）及[Pointer Events](https://www.w3.org/TR/pointerevents3/)（capture/cancel）；其他保留链接沿用原版本核对状态，不声称本次全部重读。

2026-10-10 / 1.0规则修订：按用户案例反馈补强审美保留、真实出现/滚动接线、来源弹出、Icon辨识与hover/focus造型。新增模态行为参照[WAI-ARIA APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)的模态、键盘与焦点要求；来源几何/媒体分轨与具体动效为本包自主适配，不冒称APG要求共享元素动画。五体系并列地位保持。

2026-10-10 / 1.0：依据用户反馈修正Icon局部运动、现有表现深化、窗口内部附属层生命周期、真实双向滚动与焦点保护。五体系共用家族评审；十二原则作为Disney视角内部细节，取消其额外必填字段及独立打卡流程。本次依据本地源码与Chromium实际输入，不声称重新核对全部外部来源。

## 2026-10-10 / 1.0 案例库接入

[React Bits](https://reactbits.dev/get-started/introduction)、[Vue Bits](https://vue-bits.dev/get-started/introduction)作为选型、可调预览与源码入口。核对官方React目录、两库介绍/仓库及许可；抽读AnimatedContent（React/Vue）、SpringCheck和Magnet实现。具体差异及证据边界见[reference-libraries.md](reference-libraries.md)。它们为实现与审美资源，五套设计依据保持并列。没有打包第三方组件源码，新增适配说明为自主编写；本次未完成外部浏览器预览或接入真实产品的审美A/B。

2026-10-10 / 1.0：按用户反馈加入内容驱动的尺寸与布局连续规则，覆盖文案、状态、异步内容、展开收起及响应式变化；业务立即生效，真实尺寸与相邻布局从当前呈现过渡，子内容不拉伸、可反向并恢复自然布局。细节见[layout-continuity.md](layout-continuity.md)。此为本包工程适配，没有新增外部来源权重。

2026-10-10 / 1.0：按真实使用反馈补强执行闭环、实际封面身份/普通弹窗分支、关闭后主页布局稳定、真实内容尺寸接线、可感知滚动reveal、已有反馈非降级和卡片主机制选型。这些是本包实现/验收规则，五套来源并列不变；本次规则审查没有具体用户项目源码，不能声称项目bug已修复。原外部链接与抽读状态沿用此前记录，不声称重读了全部最新API。
