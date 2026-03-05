# 🚀 OpenClaw FA Skill 快速参考手册

一页纸快速参考，打印或保存以便随时查阅。

---

## 📝 快速命令

### 通过消息渠道使用（推荐）

直接在 WhatsApp、Telegram、Slack、Discord 等任何已连接的渠道发送消息：

```
# BP 生成
"帮我生成一份商业计划书"
"我需要写个 BP"
"优化我的 BP"

# 投资人匹配
"推荐适合 Pre-A 轮的投资机构"
"哪些 VC 投企业服务？"
"分析红杉的投资偏好"

# 财务建模
"帮我做财务模型"
"做一个三年期的财务预测"
"分析我的单位经济模型"

# 估值分析
"分析项目估值"
"我的公司值多少钱？"
"用可比公司法估值"

# 融资策略
"制定融资策略"
"Pre-A 轮怎么融资？"
"给我一个融资时间表"

# Term Sheet
"解读这份 Term Sheet"
"什么是反稀释条款？"
"如何谈判估值？"

# 尽调准备
"需要准备哪些尽调材料？"
"尽调清单"
"数据室怎么搭建？"

# 行业分析
"分析 SaaS 行业"
"企业服务市场规模？"
"AI 赛道的投资趋势"
```

---

## 🎯 8 大核心功能

| 功能 | 关键词 | 输出 |
|------|--------|------|
| **BP 生成** | BP、商业计划书 | 9 章节完整 BP |
| **财务建模** | 财务模型、预测 | 三表 + 关键指标 |
| **投资人匹配** | 推荐投资人、VC | 3-5 家机构推荐 |
| **估值分析** | 估值、值多少钱 | 3 种方法估值 |
| **融资策略** | 融资策略、怎么融 | 时间线 + 里程碑 |
| **Term Sheet** | TS、条款、谈判 | 逐条解读 + 建议 |
| **尽调准备** | 尽调、材料清单 | 5 类 20+ 项清单 |
| **行业分析** | 行业、赛道、趋势 | 市场分析报告 |

---

## 📊 投资人数据库 (8 家)

| 机构 | 类型 | 阶段 | 金额范围 | 行业偏好 |
|------|------|------|----------|----------|
| **红杉中国** | VC | A/B/C | 1000-50000万 | 企业服务、消费、医疗 |
| **IDG 资本** | VC | 天使-B | 500-30000万 | 互联网、消费、医疗 |
| **高瓴资本** | PE | B-D+ | 5000-100000万 | 消费、医疗、金融科技 |
| **经纬创投** | VC | 天使-B | 500-20000万 | 企业服务、消费、医疗 |
| **五源资本** | VC | 天使-A | 300-15000万 | 消费、企业服务、医疗 |
| **真格基金** | 天使 | 天使-Pre-A | 100-3000万 | 互联网、教育、医疗 |
| **晨兴资本** | VC | Pre-A-B | 1000-20000万 | 移动互联网、电商 |
| **GGV 纪源** | VC | A-C | 1000-30000万 | 互联网、消费、企业服务 |

---

## 🛠️ 技术命令

### 部署和管理

```bash
# 一键部署
bash scripts/setup.sh

# 安装依赖
pnpm install

# 构建项目
pnpm build

# 开发模式（自动重载）
pnpm dev

# 代码检查
pnpm lint

# 格式化代码
pnpm format

# 运行测试（开发中）
pnpm test
```

### OpenClaw 管理

```bash
# 查看 skill 列表
openclaw skill list

# 启用 skill
openclaw skill enable fa

# 禁用 skill
openclaw skill disable fa

# 启动 Gateway
openclaw gateway --port 18789

# 重启 Gateway
openclaw gateway restart

# 查看日志
openclaw logs --follow

# 检查系统
openclaw doctor

# 发送测试消息
openclaw message send --to <channel> --message "测试消息"
```

---

## ⚙️ 配置选项

编辑 `~/.openclaw/config.yaml`:

```yaml
skills:
  - name: fa
    enabled: true
    config:
      # 货币单位 (CNY | USD)
      defaultCurrency: CNY

      # 语言 (zh-CN | en-US)
      defaultLanguage: zh-CN

      # 投资人数据库路径
      investorDatabasePath: /path/to/data/investors.json

      # 启用网络搜索
      enableWebSearch: true
```

---

## 🎓 最佳实践

### 1. 渐进式对话
❌ 一次性提供所有信息
✅ 让助手引导你逐步完善

### 2. 提供具体数据
❌ "收入还不错"
✅ "月收入 10 万，年增长 100%"

### 3. 多轮优化
❌ 接受第一次结果
✅ "市场分析部分可以更详细"

### 4. 组合使用
```
第一步: 生成 BP
第二步: 匹配投资人
第三步: 制定策略
第四步: 准备尽调
```

### 5. 保存重要内容
```bash
# 对话内容会被记住，但建议保存关键文档
# 复制粘贴到 Google Docs / Notion
```

---

## 📁 文件结构速查

```
ai-insurance/
├── src/                  # 源代码
│   ├── index.ts         # 主入口
│   ├── agents/          # 4 个 Agent
│   ├── tools/           # 4 个工具
│   └── utils/           # 3 个辅助函数
├── data/                # 数据
│   └── investors.json   # 8 家投资机构
├── docs/                # 文档
├── scripts/             # 脚本
│   └── setup.sh        # 一键部署
└── dist/                # 编译输出
```

---

## 🐛 故障排查

### 问题 1: Skill 未加载
```bash
# 检查链接
ls -la ~/.openclaw/skills/fa

# 检查配置
cat ~/.openclaw/config.yaml | grep fa

# 查看日志
openclaw logs --follow
```

### 问题 2: 构建失败
```bash
# 清理并重新安装
rm -rf node_modules dist
pnpm install
pnpm build
```

### 问题 3: 投资人匹配无结果
```bash
# 检查数据文件
cat data/investors.json

# 确认配置路径正确
grep investorDatabasePath ~/.openclaw/config.yaml
```

### 问题 4: 响应慢
```bash
# 检查网络搜索配置
# 如果不需要实时数据，可以禁用
enableWebSearch: false
```

---

## 📞 获取帮助

### 文档
- 📘 README.md - 项目概述
- 🚀 QUICKSTART.md - 5 分钟入门
- 📚 EXAMPLES.md - 使用示例
- 🏗️ docs/ARCHITECTURE.md - 架构
- 📖 docs/USAGE.md - 详细用法

### 支持渠道
- 💬 Discord: https://discord.gg/openclaw
- 🐛 Issues: github.com/yourusername/openclaw-fa-skill/issues
- 📧 Email: support@example.com

### 在线资源
- 🌐 OpenClaw Docs: https://openclaw.com/docs
- 📺 视频教程: (开发中)
- 💡 案例分享: (开发中)

---

## 🔑 关键术语

| 术语 | 全称 | 含义 |
|------|------|------|
| **FA** | Financial Advisor | 财务顾问/融资顾问 |
| **BP** | Business Plan | 商业计划书 |
| **VC** | Venture Capital | 风险投资 |
| **PE** | Private Equity | 私募股权 |
| **TS** | Term Sheet | 投资意向书/条款清单 |
| **DD** | Due Diligence | 尽职调查 |
| **PS** | Price-to-Sales | 市销率 |
| **DCF** | Discounted Cash Flow | 折现现金流 |
| **TAM** | Total Addressable Market | 总潜在市场 |
| **SAM** | Serviceable Addressable Market | 可服务市场 |
| **SOM** | Serviceable Obtainable Market | 可获得市场 |
| **CAC** | Customer Acquisition Cost | 获客成本 |
| **LTV** | Lifetime Value | 客户终身价值 |
| **MRR** | Monthly Recurring Revenue | 月度经常性收入 |
| **ARR** | Annual Recurring Revenue | 年度经常性收入 |

---

## ⚡ 快捷技巧

### 技巧 1: 快速 BP
```
"生成一份 SaaS 公司的 BP 模板"
→ 直接获得结构化模板，填充具体信息
```

### 技巧 2: 批量查询
```
"推荐 5 家投资企业服务的 VC"
→ 一次获取多个推荐
```

### 技巧 3: 对比分析
```
"对比红杉和经纬的投资风格"
→ 获得横向对比
```

### 技巧 4: 场景模拟
```
"如果投资人说估值太高怎么回答？"
→ 获得应对策略
```

### 技巧 5: 检查清单
```
"路演前需要准备什么？"
→ 获得完整 checklist
```

---

## 📊 常用数据参考

### 融资轮次典型金额（人民币）
- 天使轮: 100-500 万
- Pre-A: 500-2000 万
- A 轮: 2000-5000 万
- B 轮: 5000-1 亿
- C 轮: 1-3 亿
- D+ 轮: 3 亿以上

### 典型稀释比例
- 天使轮: 10-15%
- Pre-A: 15-20%
- A 轮: 15-20%
- B 轮: 10-15%
- C 轮: 10-15%

### 行业平均估值倍数（PS）
- SaaS: 6-10x
- 电商: 2-4x
- 金融科技: 4-8x
- 医疗健康: 5-10x
- 企业服务: 4-8x

---

**版本**: v0.1.0 | **更新日期**: 2026-03-05

打印或保存此页面以便快速查阅！📌
