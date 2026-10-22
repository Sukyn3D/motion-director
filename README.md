# Motion Director 1.0

![Motion Director 1.0：连续 UI 交互、组件反馈与动效编排概念封面](assets/branding/motion-director-cover.png)

让 AI 把动效原则用到真实项目里，让界面动得更连贯、更好看，也更好用。

Motion Director 是一套用于网页与 App 的 UI 动效设计、实现、优化与审查 Skill。它结合五套经典设计体系的动效思路与项目实践规则，指导 AI 发现遗漏、选择机制、接入真实组件，并通过实际操作检查结果。

## 可以用它做什么

- **优化现有界面**：保留品牌、内容、业务、技术栈和静态布局端点，补齐反馈、打磨已有动效。
- **规划完整运动语言**：依据产品语义、结构、材质和操作频率安排主次与节奏。
- **补齐交互生命周期**：覆盖适用的出现、离开、悬停、键盘焦点、按压、取消及状态变化。
- **处理连续操作**：快速重复、反向、拖动与释放时，从当前呈现继续交接，保持最新业务状态。
- **改善滚动与布局变化**：处理内容进退、重入、文案尺寸变化、列表重排和跨视图对象关系。
- **完善弹窗与媒体返回**：检查蒙层、内部内容、焦点、滚动与背景布局恢复。
- **检查实现结果**：记录真实接线、输入路径、中间呈现与未验证范围，而不只检查最终样式。

所有检查以用户授权范围和实际适用条件为准；不要求每个控件使用全部效果。

## 设计依据

Apple、Google Material 3、Disney、Microsoft Fluent 2、IBM Carbon 的设计视角并列参与：连续跟手、空间/效果分轨、主次与材质、层级编排、语义与效率。WAI 可访问性要求贯穿所有方案。

本项目对这些思路进行了 UI 工程化适配；不代表上述机构发布、授权或认可本项目。具体出处及证据边界见 [来源说明](references/sources.md)。

## 安装与使用

从本仓库的 Releases 下载 `motion-director-1.0.zip`，解压后，将整个 `motion-director` 文件夹放入所用 AI 客户端支持的 skills 目录，确保 `SKILL.md` 位于该文件夹内。

使用默认本地技能目录的 Codex 环境，可放到 `~/.codex/skills/motion-director/`；Windows 的对应用户目录通常为 `%USERPROFILE%\.codex\skills\motion-director\`。如果配置了其他技能目录，以客户端实际配置为准。让客户端重新加载技能后，可使用 `$motion-director` 调用。

### 优化当前页面

```text
请使用 $motion-director，优化当前页面的动效。
保留现有品牌、内容、业务、技术栈和静态布局端点，审查并补齐范围内
按钮、导航、卡片、内容组、滚动与弹窗的适用反馈，打磨已有有效表现。
实现后用真实操作检查快速反向、键盘、触屏和减少动效，报告未验证项。
```

### 只处理一个组件

```text
请使用 $motion-director，只优化这个收藏按钮及其相关状态。
保持布局、图标语义与业务行为，完善悬停、焦点、按压和收藏/取消的连续反馈。
```

### 只做审查

```text
请使用 $motion-director 审查当前页面，先给出覆盖缺口、连续性问题、
表现改进建议和验收计划，暂不修改代码。
```

## 包内内容

| 路径 | 内容 |
|---|---|
| [SKILL.md](SKILL.md) | 主流程、七项设计规则、实现不变量与按需资源 |
| [agents/openai.yaml](agents/openai.yaml) | 显示名称、调用示例与调用策略 |
| `references/` | 29 篇设计、覆盖、实现、验收与来源说明 |
| `assets/gallery/` | 六类各五套，共 30 套原创 Web 机制示例 |
| `assets/patterns/` | 九个深层机制原料 |
| `assets/runtime/` | 弹簧、输入状态、效果轨道、布局事务、弹窗等基础模块 |
| `assets/branding/` | 项目首页封面，AI 生成的概念示意图，非实际运行截图 |
| `assets/lab/`、`craft/`、`experience/`、`regressions/` | 机制实验、真实媒体与生命周期回归示例 |
| `scripts/` | 本地服务、目录生成、基础测试和浏览器验证工具 |

## 本地查看示例

在仓库目录下使用已有 Node.js 启动本地服务：

```sh
node scripts/serve-regressions.mjs
```

随后访问：

- [30 套模式展厅](http://127.0.0.1:4180/assets/gallery/index.html)
- [深层机制实验室](http://127.0.0.1:4180/assets/lab/index.html)
- [复合交互实验](http://127.0.0.1:4180/assets/craft/index.html)
- [交互体验实验](http://127.0.0.1:4180/assets/experience/index.html)
- [生命周期回归](http://127.0.0.1:4180/assets/regressions/index.html)

这些是本地示例地址，不是线上预览。ES modules 建议通过 HTTP 服务打开，不保证直接双击 HTML 可用。

## 验证与边界

不依赖浏览器的两组基础测试：

```sh
node scripts/test-spring.mjs
node scripts/test-lifecycle.mjs
```

这两组测试已在本地通过，分别检查标量弹簧及输入/布局辅助逻辑；它们不证明真实页面的视觉质量或设备性能。

浏览器验证需已有 Playwright 和已安装浏览器，不自动下载依赖。按 [验证说明](references/validation.md) 配置本地 URL、实际选择器和测试合同。专项验证器默认端口与上方服务可能不同，需要配置为实际地址。

- Web 示例需要按项目现有布局、业务状态和属性 owner 适配，不能整套复制后视为完成。
- 部分请求、复制、播放状态示例是模拟；交互体验页另有本地无声视频与真实媒体控件。
- 原生 App 提供平台指导，未提供整套已编译并完成真机验收的 SwiftUI/Compose 成品。
- 示例、单测和数值采样不替代真实项目验收、正常速度视觉评审、无障碍评估或真机性能测量。
- 第三方案例的预览、源码与许可具有版本和访问边界，具体采用时重新核对。

## 许可与来源

本项目按 [MIT License](LICENSE) 发布。第三方设计体系、外部链接及未来按需获取的第三方组件仍受各自条款约束；本项目许可不替代第三方许可。

外部案例库通过链接与适配说明提供入口，本包说明其可分发模式资产未包含 React Bits/Vue Bits 的第三方组件源码。相关说明见 [案例库选型与许可](references/reference-libraries.md)。
