# OpenClaw FA Skill 项目总结

## 📋 项目概述

这是一个为 OpenClaw 平台开发的一级市场投融资顾问（FA）skill，可以通过 WhatsApp、Telegram、Slack、Discord 等多种消息渠道为用户提供专业的融资顾问服务。

## 🎯 核心功能

### 1. BP 生成 (`bp-agent.ts`)
- **功能**：智能生成商业计划书
- **特点**：
  - 多轮对话收集项目信息
  - 自动生成完整的 BP 结构
  - 提供优化建议
- **使用示例**：
  ```
  用户: "帮我生成一份 BP"
  系统: 收集项目信息 → 生成 BP → 提供建议
  ```

### 2. 财务建模 (`financial-agent.ts`)
- **功能**：构建三表财务模型和估值分析
- **特点**：
  - 自动生成损益表、资产负债表、现金流量表
  - 多种估值方法（可比公司法、DCF、VC 法等）
  - 关键指标分析（毛利率、净利率、增长率等）
- **使用示例**：
  ```
  用户: "帮我做一个三年期的财务模型"
  系统: 收集假设 → 生成三表 → 计算指标 → 提供建议
  ```

### 3. 投资人匹配 (`investor-match-agent.ts`)
- **功能**：根据项目特点推荐合适的投资机构
- **特点**：
  - 智能匹配算法（行业、阶段、金额、地域）
  - 投资人画像分析
  - 匹配度评分和推荐理由
- **使用示例**：
  ```
  用户: "推荐适合 Pre-A 轮的投资机构"
  系统: 分析项目 → 匹配投资人 → 生成推荐清单
  ```
- **数据库**：包含 8 家知名投资机构（红杉、IDG、高瓴、经纬等）

### 4. 融资策略 (`strategy-agent.ts`)
- **功能**：制定融资策略和支持尽调准备
- **特点**：
  - 融资轮次和金额建议
  - 时间线规划
  - Term Sheet 解读
  - 尽调材料清单
  - 行业分析报告
- **使用示例**：
  ```
  用户: "帮我制定融资策略"
  系统: 分析项目 → 制定策略 → 生成时间线和里程碑
  ```

## 🏗️ 技术架构

### 目录结构
```
ai-insurance/
├── skill.json                 # Skill 配置和元数据
├── package.json               # 项目依赖和脚本
├── tsconfig.json             # TypeScript 配置
├── LICENSE                   # MIT 许可证
├── README.md                 # 项目说明
├── QUICKSTART.md             # 快速开始指南
├── PROJECT_SUMMARY.md        # 项目总结（本文件）
├── CONTRIBUTING.md           # 贡献指南
│
├── src/
│   ├── index.ts              # 主入口，路由和协调
│   ├── types.ts              # TypeScript 类型定义
│   │
│   ├── agents/               # 各功能代理
│   │   ├── bp-agent.ts           # BP 生成代理
│   │   ├── financial-agent.ts    # 财务建模代理
│   │   ├── investor-match-agent.ts  # 投资人匹配代理
│   │   └── strategy-agent.ts     # 融资策略代理
│   │
│   ├── tools/                # 工具函数
│   │   ├── bp-generator.ts       # BP 生成工具
│   │   ├── financial-model.ts    # 财务建模工具
│   │   ├── investor-db.ts        # 投资人数据库操作
│   │   └── valuation.ts          # 估值计算工具
│   │
│   └── utils/                # 辅助工具
│       ├── intent-parser.ts      # 用户意图识别
│       ├── investor-matcher.ts   # 投资人匹配算法
│       └── project-extractor.ts  # 项目信息提取
│
├── data/
│   ├── investors.json            # 投资人数据库（8 家机构）
│   ├── investors.example.json    # 示例数据
│   └── templates/                # BP 模板等
│
├── docs/
│   ├── ARCHITECTURE.md           # 架构设计文档
│   └── USAGE.md                  # 使用指南
│
└── dist/                     # 编译输出（构建后生成）
```

### 核心流程

1. **消息接收** → `index.ts`
2. **意图识别** → `utils/intent-parser.ts`
3. **路由分发** → 根据意图类型路由到对应 Agent
4. **Agent 处理** → 调用 tools 和 LLM 生成结果
5. **响应返回** → 返回格式化的文本或文件

### 关键技术点

- **多 Agent 架构**：每个功能模块独立的 Agent，便于维护和扩展
- **意图识别**：使用 LLM 识别用户意图，自动路由到对应功能
- **多轮对话**：支持会话状态管理，收集复杂信息
- **智能匹配**：基于多维度的投资人匹配算法
- **财务建模**：自动化财务预测和分析

## 🚀 部署指南

### 前置要求
- Node.js >= 22
- pnpm (推荐) 或 npm
- OpenClaw 已安装并运行

### 安装步骤

```bash
# 1. 进入项目目录
cd /home/justin/ai-insurance

# 2. 安装依赖
pnpm install

# 3. 构建项目
pnpm build

# 4. （可选）运行测试
pnpm test

# 5. （可选）代码检查
pnpm lint
```

### 在 OpenClaw 中配置

**方式一：通过 OpenClaw CLI**
```bash
# 链接 skill 到 OpenClaw
ln -s /home/justin/ai-insurance ~/.openclaw/skills/fa

# 启用 skill
openclaw skill enable fa

# 重启 gateway
openclaw gateway restart
```

**方式二：手动配置**

编辑 `~/.openclaw/config.yaml`：

```yaml
skills:
  - name: fa
    enabled: true
    path: /home/justin/ai-insurance/dist/index.js
    config:
      defaultCurrency: CNY
      defaultLanguage: zh-CN
      investorDatabasePath: /home/justin/ai-insurance/data/investors.json
      enableWebSearch: true
```

### 验证安装

```bash
# 1. 检查 skill 状态
openclaw skill list

# 2. 发送测试消息
openclaw message send --to <your-channel> --message "帮我生成一份 BP"

# 3. 查看日志
openclaw logs --follow
```

## 📊 数据管理

### 投资人数据库

位置：`/home/justin/ai-insurance/data/investors.json`

当前包含 8 家知名投资机构：
1. 红杉资本中国 - VC，A/B/C 轮
2. IDG 资本 - VC，天使/Pre-A/A/B 轮
3. 高瓴资本 - PE，B/C/D+ 轮
4. 经纬创投 - VC，天使/Pre-A/A/B 轮
5. 五源资本 - VC，天使/Pre-A/A 轮
6. 真格基金 - 天使，天使/Pre-A 轮
7. 晨兴资本 - VC，Pre-A/A/B 轮
8. GGV 纪源资本 - VC，A/B/C 轮

### 添加新投资人

```json
{
  "id": "unique-id",
  "name": "投资机构名称",
  "type": "vc",
  "stage_preference": ["angel", "pre-a"],
  "industry_preference": ["AI", "SaaS"],
  "region_preference": ["北京", "上海"],
  "check_size": {
    "min": 500,
    "max": 5000,
    "typical": 2000
  },
  "investment_count": 100,
  "notable_investments": ["公司1", "公司2"],
  "investment_thesis": "投资理念",
  "contact": {
    "website": "https://...",
    "email": "..."
  }
}
```

## 🧪 测试场景

### 场景 1：BP 生成
```
用户: "我有一个 SaaS 项目，需要写个 BP"
系统: 引导收集信息 → 生成 BP → 提供优化建议
```

### 场景 2：投资人匹配
```
用户: "推荐适合企业服务赛道 Pre-A 轮的投资机构"
系统: 分析需求 → 匹配投资人 → 返回推荐清单（经纬、五源、真格等）
```

### 场景 3：财务建模
```
用户: "帮我做一个三年期的财务预测"
系统: 收集业务假设 → 生成三表 → 计算指标 → 提供建议
```

### 场景 4：融资策略
```
用户: "帮我制定 Pre-A 轮的融资策略"
系统: 分析项目 → 制定策略 → 生成时间线（16-24周）→ 提供谈判技巧
```

### 场景 5：尽调准备
```
用户: "我需要准备哪些尽调材料？"
系统: 生成完整的尽调清单（5大类，20+ 项）→ 提供准备建议
```

## 🔧 自定义配置

### 语言切换
```yaml
config:
  defaultLanguage: en-US  # 切换到英文
```

### 货币单位
```yaml
config:
  defaultCurrency: USD    # 使用美元
```

### 网络搜索
```yaml
config:
  enableWebSearch: false  # 禁用网络搜索（仅使用本地数据）
```

## 📝 开发路线图

### ✅ Phase 1 - 已完成
- [x] 项目架构设计
- [x] 类型定义
- [x] 基础 Agent 框架
- [x] BP 生成功能
- [x] 财务建模功能
- [x] 投资人匹配功能
- [x] 融资策略功能
- [x] 投资人数据库（8 家机构）

### 🚧 Phase 2 - 进行中
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能优化
- [ ] 错误处理完善

### 📅 Phase 3 - 计划中
- [ ] PDF 格式 BP 导出
- [ ] Excel 格式财务模型导出
- [ ] 更多投资人数据（目标 50+ 家）
- [ ] 行业数据库（市场规模、趋势等）
- [ ] 竞品分析工具
- [ ] 路演 Deck 生成

### 🔮 Phase 4 - 未来规划
- [ ] Canvas 可视化展示
- [ ] 多语言支持（中英日韩）
- [ ] 自定义 BP 模板
- [ ] 投资人关系管理（CRM）
- [ ] 融资进度跟踪
- [ ] 数据分析仪表板

## 🤝 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何参与开发。

### 贡献方式
1. **数据贡献**：添加更多投资人信息
2. **功能开发**：实现新的 Agent 或 Tool
3. **Bug 修复**：提交 Issue 或 PR
4. **文档完善**：改进使用文档和示例

## 📞 支持

- 📝 [提交 Issue](https://github.com/yourusername/openclaw-fa-skill/issues)
- 💬 [Discord 社区](https://discord.gg/openclaw)
- 📧 Email: support@example.com

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

---

## 🎓 学习资源

### OpenClaw 相关
- [OpenClaw 官方文档](https://openclaw.com/docs)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [Skill 开发指南](https://openclaw.com/docs/skills)

### FA 知识
- [创业融资指南](https://example.com)
- [VC 投资流程](https://example.com)
- [Term Sheet 解读](https://example.com)

---

Made with ❤️ for entrepreneurs | Version 0.1.0 | Updated: 2026-03-05
