# FA Skill 使用指南

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 构建项目

```bash
pnpm build
```

### 在 OpenClaw 中启用

1. 将项目复制到 OpenClaw skills 目录：
```bash
cp -r . ~/.openclaw/skills/fa
```

2. 在 OpenClaw 配置文件中启用 skill：
```yaml
# ~/.openclaw/config.yaml
skills:
  - name: fa
    enabled: true
```

3. 重启 OpenClaw Gateway

## 功能使用

### 1. 生成商业计划书

通过任何已连接的消息渠道发送：

```
帮我生成一份 SaaS 产品的商业计划书

我有一个 AI+教育 的项目，帮我写个 BP
```

系统会引导你提供必要的项目信息，然后生成专业的 BP。

### 2. 构建财务模型

```
帮我做一个三年期的财务模型

生成财务预测表
```

### 3. 匹配投资人

```
推荐适合我项目的投资机构

我要融 A 轮，帮我找投资人
```

### 4. 估值分析

```
帮我分析一下公司估值

我的项目值多少钱？
```

### 5. 融资策略

```
帮我制定融资策略

怎么规划融资？
```

### 6. Term Sheet 解读

```
帮我看看这个 Term Sheet
[粘贴 Term Sheet 内容]
```

### 7. 尽调准备

```
我需要准备哪些尽调材料？

生成尽调清单
```

### 8. 行业分析

```
分析一下 SaaS 行业的投资趋势

企业服务赛道怎么样？
```

## 命令模式

也可以通过命令直接调用特定功能：

```bash
# 通过 OpenClaw CLI
openclaw skill run fa.generateBP --project-name "我的项目" --industry "SaaS"

openclaw skill run fa.matchInvestors --funding-round "a" --industry "AI"
```

## 配置选项

在 OpenClaw 配置文件中可以自定义 FA skill 的行为：

```yaml
skills:
  - name: fa
    enabled: true
    config:
      defaultCurrency: CNY  # 或 USD
      defaultLanguage: zh-CN  # 或 en-US
      investorDatabasePath: ./data/investors.json
      enableWebSearch: true  # 是否使用网络搜索获取最新数据
```

## 多轮对话

FA Skill 支持多轮对话，可以逐步完善信息：

```
用户: 我想融资
FA: 好的，请告诉我您的项目基本信息：项目名称、所属行业、目前阶段？

用户: 项目叫 "智能客服 Pro"，是企业服务 SaaS，目前有 50 个付费客户
FA: 明白了。您打算融哪一轮？目标金额是多少？

用户: Pre-A 轮，2000 万
FA: 好的，我来为您制定融资方案...
```

## 数据管理

### 投资人数据库

自定义投资人数据：

```bash
# 编辑投资人数据库
vim ~/.openclaw/skills/fa/data/investors.json
```

数据格式参考 `data/investors.example.json`。

### 项目历史

FA Skill 会自动保存对话历史和项目信息，方便后续继续工作。

清除历史：
```bash
rm ~/.openclaw/storage/fa-*
```

## 高级用法

### 批量处理

```typescript
// 批量匹配投资人
const projects = loadProjects();
for (const project of projects) {
  const matches = await faSkill.matchInvestors(project);
  saveReport(project.name, matches);
}
```

### 自定义模板

创建自定义的 BP 模板：

```bash
mkdir -p ~/.openclaw/skills/fa/templates
vim ~/.openclaw/skills/fa/templates/my-bp-template.md
```

### API 集成

如果需要从外部系统获取数据：

```typescript
// 集成 CRM 数据
const crmData = await fetchFromCRM(projectId);
const enrichedProject = { ...project, ...crmData };
const bp = await faSkill.generateBP(enrichedProject);
```

## 常见问题

### Q: 生成的 BP 质量如何提高？

A: 提供更详细的项目信息，包括：
- 具体的业务数据和指标
- 团队背景介绍
- 竞品分析
- 已有客户案例

### Q: 投资人推荐不准确怎么办？

A:
1. 更新投资人数据库
2. 提供更多项目细节
3. 指定特定的偏好（如地域、阶段）

### Q: 如何获取最新的行业数据？

A: 启用 `enableWebSearch: true` 选项，系统会自动搜索最新的行业报告和数据。

### Q: 支持英文吗？

A: 支持。设置 `defaultLanguage: en-US` 即可切换为英文模式。

## 反馈和贡献

遇到问题或有改进建议？

- 提交 Issue: https://github.com/yourusername/openclaw-fa-skill/issues
- 贡献代码: https://github.com/yourusername/openclaw-fa-skill/pulls

## 更多资源

- [OpenClaw 文档](https://openclaw.com/docs)
- [Skill 开发指南](https://openclaw.com/docs/skills)
- [FA 行业最佳实践](./BEST_PRACTICES.md)
