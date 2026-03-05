# OpenClaw FA Skill - 一级市场投融资顾问

一个为 OpenClaw 平台开发的智能 FA（Financial Advisor）技能，提供全方位的一级市场投融资顾问服务。

## 功能概览

### 🎯 核心功能

1. **BP 生成与优化**
   - 智能生成商业计划书
   - 多轮对话优化 BP 内容
   - 行业对标分析

2. **财务建模**
   - 三表模型自动生成
   - 多情景财务预测
   - 估值计算与分析

3. **投资人匹配**
   - 智能分析投资机构偏好
   - 精准匹配推荐
   - 投资人画像生成

4. **融资策略**
   - 融资轮次规划
   - 估值谈判建议
   - Term Sheet 解读

5. **尽调支持**
   - 材料清单生成
   - 数据室结构建议
   - 常见问题预演

6. **行业分析**
   - 赛道趋势分析
   - 竞品分析
   - 市场规模测算

## 技术架构

```
openclaw-fa-skill/
├── skill.json          # Skill 配置文件
├── src/
│   ├── index.ts       # 主入口
│   ├── agents/        # 各功能代理
│   │   ├── bp-agent.ts
│   │   ├── financial-agent.ts
│   │   ├── investor-match-agent.ts
│   │   └── strategy-agent.ts
│   ├── tools/         # 工具函数
│   │   ├── bp-generator.ts
│   │   ├── financial-model.ts
│   │   ├── investor-db.ts
│   │   └── valuation.ts
│   ├── data/          # 数据存储
│   │   ├── investors.json
│   │   ├── templates/
│   │   └── industry-data/
│   └── utils/         # 工具函数
├── prompts/           # Prompt 模板
├── tests/
└── package.json
```

## 快速开始

### 安装

```bash
# 克隆项目
cd ~/.openclaw/skills
git clone <this-repo> fa-skill
cd fa-skill

# 安装依赖
pnpm install

# 构建
pnpm build
```

### 在 OpenClaw 中启用

```bash
# 通过 OpenClaw CLI 启用 skill
openclaw skill enable fa

# 或在配置文件中添加
# ~/.openclaw/config.yaml
skills:
  - name: fa
    enabled: true
```

### 使用示例

```bash
# 通过消息渠道使用
# 在 Telegram/WhatsApp/Slack 等任何已连接的渠道中：

"帮我生成一份 SaaS 产品的 BP"
"分析一下企业服务赛道的投资趋势"
"推荐适合 Pre-A 轮的投资机构"
"帮我做一个三年期的财务模型"
"这份 Term Sheet 有什么要注意的？"
```

## 使用场景

### 1. 创业者自助融资
```
用户: "我有一个 AI+教育 的创业项目，需要融资建议"
FA: 开始项目评估 → 生成 BP → 推荐投资人 → 提供策略建议
```

### 2. FA 辅助工具
```
用户: "帮我分析这个项目适合哪些投资机构"
FA: 项目画像分析 → 投资人数据库匹配 → 生成推荐清单
```

### 3. 投资人研究
```
用户: "分析红杉中国的投资偏好"
FA: 历史投资数据分析 → 偏好画像 → 投资策略总结
```

## 开发计划

- [ ] Phase 1: 基础架构搭建
- [ ] Phase 2: BP 生成与优化
- [ ] Phase 3: 财务建模工具
- [ ] Phase 4: 投资人数据库
- [ ] Phase 5: 智能匹配算法
- [ ] Phase 6: 融资策略引擎
- [ ] Phase 7: 尽调支持工具

## 技术栈

- **运行时**: Node.js 22+
- **语言**: TypeScript
- **AI 模型**: Claude (via OpenClaw)
- **数据存储**: JSON + SQLite
- **财务计算**: xlsx, financial.js

## 许可证

MIT
