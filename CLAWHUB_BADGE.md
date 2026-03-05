# ClawHub 徽章

在 README.md 中添加 ClawHub 徽章可以让用户知道这个 Skill 可以在 ClawHub 上找到。

## 📛 徽章代码

### Markdown

```markdown
[![Available on ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiAxMkwxMiAyMkwyMiAxMkwxMiAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+)](https://clawhub.ai/skills/fa-financial-advisor)
```

### HTML

```html
<a href="https://clawhub.ai/skills/fa-financial-advisor">
  <img src="https://img.shields.io/badge/ClawHub-Available-4F46E5?style=for-the-badge" alt="Available on ClawHub">
</a>
```

## 🎨 徽章样式

### 风格 1: for-the-badge（推荐）

![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=for-the-badge)

```markdown
![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=for-the-badge)
```

### 风格 2: flat

![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=flat)

```markdown
![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=flat)
```

### 风格 3: flat-square

![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=flat-square)

```markdown
![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=flat-square)
```

### 风格 4: plastic

![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=plastic)

```markdown
![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=plastic)
```

## 📝 完整徽章组合示例

将以下代码添加到 README.md 顶部：

```markdown
# OpenClaw FA Skill

[![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat-square)](https://github.com/yourusername/openclaw-fa-skill/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=flat-square)](https://clawhub.ai/skills/fa-financial-advisor)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Skill-orange?style=flat-square)](https://openclaw.com)

一级市场投融资顾问 AI Skill...
```

效果：

![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=flat-square)
![OpenClaw](https://img.shields.io/badge/OpenClaw-Skill-orange?style=flat-square)

## 🔗 添加安装链接

在 README.md 中添加明显的安装按钮：

```markdown
## 快速开始

### 方式一：从 ClawHub 安装（推荐）

访问 [ClawHub](https://clawhub.ai/skills/fa-financial-advisor) 一键安装

或在 OpenClaw 中运行：
\`\`\`bash
openclaw install fa-financial-advisor
\`\`\`

### 方式二：从源码安装

\`\`\`bash
git clone https://github.com/yourusername/openclaw-fa-skill.git
cd openclaw-fa-skill
bash scripts/setup.sh
\`\`\`
```

## 📊 动态徽章（如果 ClawHub 支持）

如果 ClawHub 提供 API，可以使用动态徽章：

```markdown
<!-- 下载量 -->
![Downloads](https://img.shields.io/badge/dynamic/json?url=https://api.clawhub.ai/skills/fa-financial-advisor/stats&query=$.downloads&label=downloads&color=4F46E5)

<!-- 评分 -->
![Rating](https://img.shields.io/badge/dynamic/json?url=https://api.clawhub.ai/skills/fa-financial-advisor/stats&query=$.rating&label=rating&suffix=/5&color=4F46E5)
```

## 💡 使用建议

1. **放在 README 顶部** - 让用户第一时间看到
2. **保持简洁** - 不要放太多徽章
3. **链接到 ClawHub** - 方便用户直接安装
4. **定期更新** - 版本号等信息要及时更新

## 🎯 完整示例

这是一个完整的 README.md 头部示例：

```markdown
<div align="center">

# 💼 OpenClaw FA Skill

**一级市场投融资顾问 AI Skill**

[![Version](https://img.shields.io/badge/version-0.1.0-blue?style=for-the-badge)](https://github.com/yourusername/openclaw-fa-skill/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](./LICENSE)
[![ClawHub](https://img.shields.io/badge/ClawHub-Available-4F46E5?style=for-the-badge)](https://clawhub.ai/skills/fa-financial-advisor)

[🚀 快速开始](#快速开始) •
[📖 文档](#文档) •
[💬 社区](https://discord.gg/openclaw) •
[🐛 报告问题](https://github.com/yourusername/openclaw-fa-skill/issues)

</div>

---

## 📋 简介

专业的一级市场投融资顾问 (FA) AI Skill，提供：

- 📝 BP 生成
- 💰 财务建模
- 🎯 投资人匹配
- 📊 估值分析
- 🚀 融资策略
- 📄 Term Sheet 解读
- 📋 尽调准备
- 📈 行业分析

...
```

---

**更新时间**: 2026-03-05
**需要帮助？** 查看 [CLAWHUB_PUBLISH.md](./CLAWHUB_PUBLISH.md)
