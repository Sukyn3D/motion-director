#!/usr/bin/env node
import {catalog,families} from '../assets/gallery/catalog.mjs';
import fs from 'node:fs/promises';
const lines=['# 六类各五套动效模式','', '按审计结果选机制；不按组件类型硬套。全部为自主实现的原生 Web 范例，可在现有 React/Vue/Svelte 或原生平台中适配语义与机制。六个模块每个导出 `mount(root, id, pref)`，返回 `{ destroy() }`；`pref`来自 `assets/runtime/motion-runtime.mjs` 的 `createPreference()`。HTML由模块构造，配套样式在 `assets/gallery/gallery.css`，仅按需提取。', '', '[可运行展厅](../assets/gallery/index.html) · [深层机制实验室](../assets/lab/index.html) · [三阶段设计合同](design-contract.md)', '', '启动本地静态服务器后访问展厅，ES module 不能保证以双击 file:// 加载。示例请求、播放、复制是明确标记的模拟，不接入真实服务。共享对象示例只在同一局部视图，不能声称跨文档转场。原生 App 当前仅有适配指导，未提供30套SwiftUI/Compose真机代码。', ''];
for(const [family,name] of Object.entries(families)){
 lines.push(`## ${name}`,'');
 for(const p of catalog.filter(x=>x.family===family))lines.push(`### ${p.id.toUpperCase()} · ${p.title}`,'',`- 效果：${p.effect}`,`- 适用：${p.use}`,`- 不适用：${p.avoid}`,`- 状态合同：${p.contract}`,`- 可运行代码：[${family}.mjs / ${p.id}](../assets/gallery/${p.code})；[操作范例](../assets/gallery/index.html#${p.id})`,'');
}
lines.push('## 公共集成不变量','','一个属性一个动画所有者；视觉与语义分轨；最新意图优先；可按当前呈现改目标；卸载释放本控制器的事件、订阅、计时器与动画。以实际静态布局作为端点，测量在范围内的坐标；动态内容尺寸不能照抄demo的固定高度。保持项目既有语义、稳定key、焦点规则和请求管理。Shared element优先平台/现有库，无法保证身份时退回短非空间变化。','','实现后按 [validation.md](validation.md) 观察正常、中途反向、快速输入和相关键盘/触控/减少动效。复制代码文件名或出现helper不构成验证。');
await fs.writeFile(new URL('../references/catalog.md',import.meta.url),lines.join('\n')+'\n');console.log('Generated 30 patterns across 6 families.');
