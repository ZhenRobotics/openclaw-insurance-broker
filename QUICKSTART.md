# 🚀 快速开始指南

## 项目概述

OpenClaw FA Skill 是一个智能投融资顾问，可以帮助创业者：

- 📝 生成专业的商业计划书
- 💰 构建财务模型和估值分析
- 🎯 智能匹配合适的投资机构
- 📊 制定融资策略和路线图
- 📋 准备尽调材料
- 📈 行业趋势分析

通过 WhatsApp、Telegram、Slack、Discord 等任何 OpenClaw 支持的渠道使用。

## 5 分钟快速部署

### 1. 前置要求

- Node.js >= 22
- pnpm（推荐）或 npm
- OpenClaw 已安装并运行

### 2. 安装

```bash
# 克隆或下载项目到 OpenClaw skills 目录
cd ~/.openclaw/skills
cp -r /path/to/this/project ./fa

# 进入目录
cd fa

# 安装依赖
pnpm install

# 构建项目
pnpm build
```

### 3. 配置 OpenClaw

编辑 OpenClaw 配置文件：

```bash
vim ~/.openclaw/config.yaml
```

添加 FA skill：

```yaml
skills:
  - name: fa
    enabled: true
    config:
      defaultCurrency: CNY
      defaultLanguage: zh-CN
      investorDatabasePath: ./data/investors.json
      enableWebSearch: true
```

### 4. 重启 OpenClaw

```bash
# 如果使用 daemon
openclaw gateway restart

# 或手动重启
openclaw gateway --port 18789
```

### 5. 测试使用

在任何已连接的消息渠道（WhatsApp/Telegram/Slack 等）发送：

```
帮我生成一份商业计划书
```

系统会开始引导你完成 BP 生成流程！

## 核心功能演示

### 功能 1: 生成 BP

```
你: 我有一个 SaaS 项目，需要写个 BP
FA: 好的，请告诉我您的项目基本信息...

[多轮对话后]

FA: ✅ 已为您生成商业计划书
    📊 商业计划书大纲
    1. 执行摘要
       ...
```

### 功能 2: 匹配投资人

```
你: 推荐适合 Pre-A 轮的投资机构，企业服务赛道
FA: 🎯 为您推荐以下投资机构

    **1. 红杉资本中国**
       匹配度: 85% ⭐⭐⭐⭐⭐
       类型: 风险投资 (VC)
       偏好阶段: a, b, c
       投资金额: 1000-50000 万元
       ...
```

### 功能 3: 财务建模

```
你: 帮我做一个三年期的财务模型
FA: 💰 三年期财务模型

    📈 损益表 (单位: 万元)
    |  项目  | 第1年 | 第2年 | 第3年 |
    |--------|-------|-------|-------|
    | 营业收入 | 100 | 200 | 400 |
    ...
```

### 功能 4: 估值分析

```
你: 帮我分析一下公司估值
FA: 🎯 估值分析报告

    估值方法: 可比公司法
    估值区间 (单位: 万元)
    - 保守估计: 3,500
    - 中性估计: 5,000
    - 乐观估计: 6,500
    ...
```

### 功能 5: 融资策略

```
你: 帮我制定融资策略
FA: 🚀 融资策略方案

    融资概要
    - 推荐轮次: Pre-A
    - 目标金额: 2,000 万元
    - 预计稀释: 15%
    ...
```

### 功能 6: 尽调准备

```
你: 我需要准备哪些尽调材料？
FA: 📋 尽职调查材料清单

    预计准备时间: 4-6 周

    **1. 公司基本信息**
    🔴 [必需] 营业执照
    ...
```

### 功能 7: 行业分析

```
你: 分析一下 SaaS 行业的投资趋势
FA: 📈 SaaS 行业分析报告

    1. 行业概况
       ...
    2. 市场规模
       ...
```

## 自定义投资人数据库

内置了 8 家知名投资机构数据，你可以添加更多：

```bash
# 复制示例文件
cp data/investors.example.json data/investors.json

# 编辑添加你的投资人数据
vim data/investors.json
```

数据格式：

```json
{
  "id": "investor-id",
  "name": "投资机构名称",
  "type": "vc",
  "stage_preference": ["a", "b"],
  "industry_preference": ["SaaS", "AI"],
  "check_size": {
    "min": 1000,
    "max": 10000,
    "typical": 3000
  },
  ...
}
```

## 高级配置

### 切换到英文模式

```yaml
skills:
  - name: fa
    config:
      defaultLanguage: en-US
```

### 使用美元作为货币单位

```yaml
skills:
  - name: fa
    config:
      defaultCurrency: USD
```

### 禁用网络搜索

```yaml
skills:
  - name: fa
    config:
      enableWebSearch: false
```

## 常见问题

### Q: 如何提高 BP 质量？

A: 提供更详细的项目信息：
- 具体的业务数据和指标
- 团队背景介绍
- 竞品分析
- 已有客户案例

### Q: 投资人推荐不准怎么办？

A:
1. 更新投资人数据库（添加更多机构）
2. 提供更详细的项目信息
3. 明确指定偏好（如地域、阶段）

### Q: 能生成 PDF 格式的 BP 吗？

A: 当前版本暂不支持，计划在 Phase 2 添加。目前输出的是结构化文本，可以复制到 Word 中编辑。

### Q: 支持多语言吗？

A: 目前支持中文和英文。通过配置 `defaultLanguage` 切换。

### Q: 数据存储在哪里？

A:
- 投资人数据：`~/.openclaw/skills/fa/data/investors.json`
- 会话历史：`~/.openclaw/storage/fa-*`
- 用户配置：`~/.openclaw/config.yaml`

## 下一步

- 📖 阅读[完整使用指南](./docs/USAGE.md)
- 🏗️ 了解[架构设计](./docs/ARCHITECTURE.md)
- 🤝 查看[贡献指南](./CONTRIBUTING.md)
- 💬 加入我们的 Discord 社区

## 支持

遇到问题？

- 📝 [提交 Issue](https://github.com/yourusername/openclaw-fa-skill/issues)
- 💬 [Discord 讨论](https://discord.gg/openclaw)
- 📧 Email: support@example.com

## 许可证

MIT License - 详见 [LICENSE](./LICENSE)

---

Made with ❤️ for entrepreneurs
