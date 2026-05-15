# Xpilot (MahjongXpilot)

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vuedotjs" alt="Vue 3">
  <img src="https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Pinia-State_Management-FFE56B?style=flat-square" alt="Pinia">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg?style=flat-square" alt="License"></a>
</p>

Xpilot 是基于 `Vue 3` + `Tailwind CSS` + `DaisyUI` 开发的一个日本麻将（Riichi Mahjong）辅助工具集网站，旨在帮助日麻玩家提升雀力。项目集成了牌效分析、何切训练、点数计算等实用功能，并对不同终端进行了深度可用性适配，为您提供最直观、便捷的日麻学习与实战支持体验。

## ✨ 主要功能 (Features)

- 🀄️ **牌效率分析**：自动分析当前手牌，给出最优舍牌建议。支持进张分析、好形率与期望值 (EV) 计算，提升和牌速度与效率。
- 🧩 **何切练习**：内置收录超 600+ 经典何切题目，优化移动端阅读与作答体验，训练判断力。
- 🧮 **点数计算与练习**：支持符数、番数快捷点数心算练习，点数计算支持使用 `k/w` 后缀快捷输入并自动随机生成练习题。
- 🀪 **清一色听牌训练**：自动随机生成高难度清一色牌型，锻炼多面听的瞬间判断力与实战应对能力。
- 🌍 **多语言支持 (i18n)**：支持简繁中、英、日、法、西、韩等多途径切换。

## 🛠️ 技术栈 (Tech Stack)

- **前端框架:** Vue 3 (Composition API)
- **状态管理:** Pinia
- **构建工具:** Vite
- **样式与组件:** Tailwind CSS, DaisyUI
- **路由与语言:** Vue Router, Vue I18n

## 🚀 快速开始 (Quick Start)

```bash
# 克隆项目
git clone https://github.com/fyisvia/Xpilot.git

# 进入目录
cd Xpilot

# 安装依赖项
npm install

# 启动本地开发服务器
npm run dev
```

## 📢 最新更新 (Recent Updates)

### v1.6.0 (2026-05-13) 🎯
- 🚀 **底层重构**：全面引入 Pinia 进行状态管理，重绘生命周期，提取分离词典等硬编码的静态数据。
- 📚 **题库升级**：更新收录 600+ 何切练习，同时优化了题目显示模板及移动端的滚动位移体验。
- ⚡ **性能飙升**：大幅优化系统性能，好形率与 EV 的计算机制改为按需触发计算 (On-demand compute)。
- ⌨️ **算法增强**：重写并完善了核心辅助计算相关的统计算法逻辑。并为点数计算加入 `k/w` 后缀输入功能。
- 🎨 **UI 体验提升**：提升了各版块的交互与 UI 体验，修复了一些已知问题。

*(过往旧版本的更新记录，请查阅应用内“关于本站”日志或 [Releases](https://github.com/fyisvia/Xpilot/releases))*

## 🤝 参与贡献 (Contributing)

欢迎提交 Issue 或 Pull Request 参与项目开发与优化。贡献前请先阅读并遵守 [LICENSE](./LICENSE) 协议。

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📫 联系与反馈 (Contact & Feedback)

- **📧 联系作者**：[contact@fyisvia.com](mailto:contact@fyisvia.com)
- **🐛 问题反馈**：请在项目 [Issues](https://github.com/fyisvia/Xpilot/issues) 页面提交您的建议或 Bug。

## 📄 许可证 (License)

本项目基于 [GNU AGPL v3](./LICENSE) 协议开源发布。
> **注意：** 部分非代码资产（数据集、题库收录内容或媒体等）不在 AGPL 授权范围内。未经作者书面许可，严禁二次分发或公开搬运这些数据，详情请查阅 LICENSE 文件。
