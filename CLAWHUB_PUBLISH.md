# 🚀 发布到 ClawHub.ai 指南

本指南将帮助您将 FA Skill 发布到 ClawHub.ai 上，让全球用户都能使用。

---

## 📋 准备工作

### 1. 确认文件完整

确保以下文件已准备好：

```bash
# 检查必需文件
ls -la clawhub.json          # ClawHub 配置文件 ✅
ls -la package.json          # npm 包配置 ✅
ls -la README.md             # 项目说明 ✅
ls -la LICENSE               # 许可证 ✅
ls -la dist/                 # 编译输出 ✅
```

### 2. 构建项目

```bash
# 确保项目已构建
pnpm install
pnpm build

# 验证构建输出
ls -la dist/
```

### 3. 准备资源文件

#### 图标和截图

创建以下资源文件（推荐尺寸）：

```bash
mkdir -p assets/screenshots

# 需要准备的图片：
# - assets/icon.png (512x512 px) - Skill 图标
# - assets/screenshots/bp-generation.png - BP 生成示例
# - assets/screenshots/investor-matching.png - 投资人匹配示例
# - assets/screenshots/financial-model.png - 财务模型示例
```

**图标建议**：
- 使用 💼 或相关金融图标
- 背景色: #4F46E5 (靛蓝色)
- 简洁专业的设计

**截图建议**：
- 展示实际使用场景
- 包含输入和输出
- 高清晰度（至少 1920x1080）

---

## 🌐 发布步骤

### 方式一：通过 ClawHub Web 界面（推荐）

#### 步骤 1: 注册/登录 ClawHub

访问 https://clawhub.ai 并登录您的账号。

#### 步骤 2: 创建新 Skill

1. 点击 **"Publish Skill"** 或 **"发布 Skill"**
2. 选择 **"Import from GitHub"** 或手动上传

#### 步骤 3: 上传配置

如果选择手动上传：

1. 上传 `clawhub.json` 文件
2. 系统会自动解析配置

#### 步骤 4: 填写详细信息

根据 `clawhub.json` 预填的信息，确认或调整：

- **基本信息**
  - Name: FA - 投融资顾问
  - Display Name: FA Financial Advisor
  - Version: 0.1.0
  - Category: Business
  - License: MIT

- **描述**
  - 简短描述（从 description 字段）
  - 详细描述（从 longDescription 字段）

- **功能特性**
  - 8 个核心功能（自动填充）

- **标签和关键词**
  - 已预设 12+ 个标签
  - 可根据需要添加更多

#### 步骤 5: 上传资源

1. **图标**: 上传 512x512 的 PNG 图标
2. **截图**: 上传 3-5 张功能截图
3. **演示视频**（可选）: YouTube 链接

#### 步骤 6: 设置配置选项

在配置页面设置用户可调整的选项：

- 默认货币 (CNY/USD)
- 默认语言 (zh-CN/en-US)
- 启用网络搜索 (true/false)

#### 步骤 7: 提供示例

添加使用示例（已在 clawhub.json 中预设）：

```
"帮我生成一份 SaaS 产品的商业计划书"
"推荐适合 Pre-A 轮的投资机构"
"帮我做一个三年期的财务模型"
"分析项目估值"
"制定融资策略"
```

#### 步骤 8: 审核和发布

1. 点击 **"Preview"** 预览发布页面
2. 检查所有信息是否正确
3. 点击 **"Submit for Review"** 提交审核
4. 等待 ClawHub 团队审核（通常 1-3 个工作日）

---

### 方式二：通过 CLI 发布

如果 ClawHub 提供 CLI 工具：

```bash
# 安装 ClawHub CLI
npm install -g clawhub-cli

# 登录
clawhub login

# 初始化（如果还没有 clawhub.json）
clawhub init

# 发布
clawhub publish

# 或指定配置文件
clawhub publish --config clawhub.json
```

---

### 方式三：通过 GitHub 集成

如果您的代码在 GitHub 上：

#### 步骤 1: 推送到 GitHub

```bash
# 如果还没有创建 Git 仓库
git init
git add .
git commit -m "Initial commit: FA Skill v0.1.0"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/yourusername/openclaw-fa-skill.git
git branch -M main
git push -u origin main
```

#### 步骤 2: 在 ClawHub 关联 GitHub

1. 登录 ClawHub.ai
2. 进入 Settings → Integrations
3. 连接 GitHub 账号
4. 选择 `openclaw-fa-skill` 仓库
5. ClawHub 会自动读取 `clawhub.json` 并创建 Skill 页面

#### 步骤 3: 触发发布

每次推送新的 tag 到 GitHub 时自动更新 ClawHub：

```bash
# 创建新版本
git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0
```

---

## 📦 发布检查清单

在提交发布前，请确认：

### 必需项 ✅

- [ ] `clawhub.json` 文件已创建并填写完整
- [ ] `package.json` 中的信息与 clawhub.json 一致
- [ ] README.md 清晰说明了使用方法
- [ ] LICENSE 文件存在（MIT）
- [ ] 项目已构建（dist/ 目录存在）
- [ ] 所有代码已通过 linting
- [ ] 功能已本地测试通过

### 推荐项 ⭐

- [ ] 提供 512x512 的高质量图标
- [ ] 至少 3 张功能截图
- [ ] 演示视频（YouTube/Bilibili）
- [ ] 详细的使用示例（6 个已提供）
- [ ] 完善的文档（已提供 15 篇）
- [ ] FAQ 文档（45 个问题已提供）
- [ ] CHANGELOG.md 记录版本变化
- [ ] GitHub 仓库已设置（包含 README、Issues、Discussions）

### 可选项 💡

- [ ] 设置 GitHub Actions CI/CD
- [ ] 添加 badges（版本、下载量、许可证等）
- [ ] 创建 GitHub Pages 项目网站
- [ ] 录制使用教程视频
- [ ] 准备多语言文档（英文版）

---

## 🎨 资源准备指南

### 图标设计

**方式一：使用 Emoji（最简单）**

```javascript
// 已在 clawhub.json 中设置
"icon": "💼"
```

**方式二：设计专业图标**

使用工具：
- Figma（推荐）
- Canva
- Adobe Illustrator

设计要点：
- 尺寸: 512x512 px
- 格式: PNG（透明背景）
- 主色: #4F46E5（靛蓝色）
- 简洁、专业、易识别

**参考设计元素**：
- 💼 公文包（代表商务）
- 📊 图表（代表分析）
- 💰 金钱（代表融资）
- 🎯 靶心（代表精准匹配）

### 截图制作

**需要的截图**：

1. **BP 生成截图**
   - 展示用户输入项目信息
   - 展示生成的 BP 大纲和内容
   - 尺寸: 1920x1080 或 1280x720

2. **投资人匹配截图**
   - 展示匹配结果列表
   - 显示匹配度评分
   - 显示推荐理由

3. **财务模型截图**
   - 展示三表数据
   - 显示关键指标
   - 图表可视化（如有）

**制作工具**：
- 截图: macOS Screenshot / Windows Snipping Tool
- 编辑: Figma / Photoshop / GIMP
- 注释: Skitch / Annotate

**注意事项**：
- 使用真实但脱敏的数据
- 确保界面清晰可读
- 添加适当的注释说明关键功能

### 演示视频（可选）

**视频内容**：
1. 开场（10s）：介绍 FA Skill
2. 功能演示（2-3 分钟）：
   - BP 生成流程
   - 投资人匹配
   - 财务建模
3. 总结（10s）：强调核心价值

**录制工具**：
- macOS: QuickTime / OBS
- Windows: OBS / Camtasia
- 在线: Loom / Screencastify

**上传位置**：
- YouTube（国际用户）
- Bilibili（中国用户）

---

## 📝 描述文案优化

### 简短描述（用于列表展示）

已优化版本（clawhub.json 中的 description）：
```
一级市场投融资顾问 AI Skill，提供 BP 生成、财务建模、投资人匹配、融资策略等全方位服务
```

### 详细描述（用于详情页）

已优化版本（clawhub.json 中的 longDescription）：
```markdown
专业的一级市场投融资顾问 (FA) AI Skill，替代传统融资顾问，为创业者提供:

• 📝 BP 生成 - 智能生成 9 章节完整商业计划书
• 💰 财务建模 - 三表模型 + 关键指标分析
• 🎯 投资人匹配 - 基于 8 家知名投资机构的智能推荐
• 📊 估值分析 - 3 种估值方法综合分析
• 🚀 融资策略 - 完整的时间线和里程碑规划
• 📄 Term Sheet 解读 - 条款分析和谈判建议
• 📋 尽调准备 - 5 大类材料清单
• 📈 行业分析 - 市场趋势和竞争格局

节省 95%+ 融资成本，提高 20 倍工作效率！
```

### 关键卖点（Highlights）

1. **省钱** - 节省传统 FA 5-8% 股权费用
2. **省时** - 从 2-4 周缩短到即时生成
3. **专业** - 基于行业最佳实践和真实数据
4. **全面** - 覆盖融资全流程 8 大功能
5. **易用** - 自然语言交互，零学习成本

---

## 🔍 SEO 优化

### 标签选择

已优化的标签（clawhub.json 中）：
```json
"tags": [
  "finance", "fundraising", "venture-capital",
  "business-plan", "financial-modeling",
  "investor-matching", "startup", "entrepreneurship",
  "fa", "融资", "投资", "商业计划书"
]
```

### 关键词优化

```json
"keywords": [
  "FA", "Financial Advisor", "投融资顾问",
  "商业计划书", "BP", "融资", "投资人", "VC",
  "创业", "估值", "财务模型"
]
```

---

## 🎯 目标用户定位

在 ClawHub 上清晰定位您的目标用户：

### 主要用户
- 🚀 **早期创业者** - 需要融资但预算有限
- 💼 **项目负责人** - 负责公司融资事务
- 📊 **FA 从业者** - 需要提高工作效率

### 次要用户
- 🏫 **商学院学生** - 学习融资知识
- 📚 **投资人** - 快速分析项目
- 🎓 **创业导师** - 辅导学员融资

---

## 📊 发布后的推广

### 1. 社交媒体

**发布公告模板**：

```markdown
🎉 我们在 ClawHub 上发布了 FA Skill！

一个专业的一级市场投融资顾问 AI，可以帮你：
• 生成专业 BP
• 匹配投资人
• 做财务模型
• 制定融资策略

完全免费！立即体验 👉 https://clawhub.ai/skills/fa-financial-advisor

#OpenClaw #创业 #融资 #AI
```

**发布渠道**：
- Twitter / X
- LinkedIn
- 微信公众号
- 知乎
- 即刻
- V2EX
- Product Hunt

### 2. 社区推广

- OpenClaw Discord 社区
- 创业社群（如创业邦、36氪）
- GitHub Discussions
- Reddit (r/startups, r/entrepreneur)

### 3. 内容营销

撰写相关文章：
- "如何用 AI 替代融资顾问节省 95% 成本"
- "创业者必备：AI 驱动的融资工具"
- "我们开源了一个 AI FA Skill"

### 4. 合作推广

寻求合作：
- 创业孵化器
- 创业加速器
- 商学院创业中心
- FA 公司（作为效率工具）

---

## 📈 发布后监控

### 关键指标

在 ClawHub 后台关注：
- ⬇️ 安装量
- ⭐ 评分和评论
- 📊 使用频率
- 🐛 错误报告
- 💬 用户反馈

### 持续优化

1. **收集反馈**
   - 阅读用户评论
   - 回复用户问题
   - 收集功能建议

2. **快速迭代**
   - 修复 bug
   - 添加新功能
   - 优化性能

3. **版本更新**
   - 定期发布新版本
   - 记录 CHANGELOG
   - 通知用户更新

---

## 🆘 常见问题

### Q1: ClawHub 审核需要多长时间？

**A:** 通常 1-3 个工作日。确保所有信息完整准确可以加快审核。

### Q2: 如何更新已发布的 Skill？

**A:**
- 增加版本号（如 0.1.0 → 0.1.1）
- 重新发布或推送 GitHub tag
- ClawHub 会自动更新

### Q3: 可以发布私有 Skill 吗？

**A:**
- ClawHub 主要面向公开 Skill
- 如需私有，可以在 GitHub 设置为 private

### Q4: 如何获得 "Verified" 标记？

**A:**
- 完善所有资料
- 提供高质量文档
- 获得社区好评
- 联系 ClawHub 团队申请

### Q5: 可以收费吗？

**A:**
- 当前版本设置为免费（community tier）
- 如需商业化，需要升级计划
- 联系 ClawHub 团队了解详情

---

## 📞 获取帮助

如果在发布过程中遇到问题：

1. **查看 ClawHub 文档**: https://clawhub.ai/docs
2. **联系 ClawHub 支持**: support@clawhub.ai
3. **加入 Discord**: https://discord.gg/openclaw
4. **查看本项目 FAQ**: [FAQ.md](./FAQ.md)

---

## ✅ 发布后检查清单

发布成功后：

- [ ] 在 ClawHub 上能找到您的 Skill
- [ ] 所有信息显示正确
- [ ] 图标和截图正常显示
- [ ] 可以正常安装
- [ ] 功能测试通过
- [ ] 在社交媒体宣布发布
- [ ] 在 GitHub 添加 ClawHub badge
- [ ] 监控用户反馈

---

## 🎉 恭喜！

您已经准备好将 FA Skill 发布到 ClawHub.ai 了！

**立即开始**: https://clawhub.ai/publish

---

**文档版本**: v1.0
**最后更新**: 2026-03-05

如有疑问，请参考 [FAQ.md](./FAQ.md) 或提交 [Issue](https://github.com/yourusername/openclaw-fa-skill/issues)
