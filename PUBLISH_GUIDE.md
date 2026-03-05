# 📦 发布指南 - Insurance Broker Skill

## 🎯 发布策略："占坑" + 迭代

本指南帮助您将 **v0.1.0 MVP 版本**快速发布到 ClawHub 和 npm，占据项目名称，后续持续迭代。

---

## ✅ 发布前检查清单

### 1. 文件准备 ✅

- [x] `package.json` - npm 发布配置
- [x] `clawhub.json` - ClawHub 发布配置
- [x] `README.md` - 项目说明
- [x] `LICENSE` - MIT 许可证
- [x] `CHANGELOG.md` - 版本变更记录
- [x] `src/` - 源代码
- [x] `data/` - 产品数据库
- [x] `tsconfig.json` - TypeScript 配置

### 2. 代码构建

```bash
# 确保代码可以构建
cd /home/justin/ai-insurance
npm run build

# 检查构建产物
ls dist/
```

### 3. 测试运行

```bash
# 本地测试
npm run test

# 或手动测试核心功能
node dist/index.js
```

---

## 📦 方式一：发布到 npm

### Step 1: 注册 npm 账号

如果还没有 npm 账号：
```bash
# 访问 https://www.npmjs.com 注册账号
# 或使用命令行
npm adduser
```

### Step 2: 登录 npm

```bash
npm login
# 输入用户名、密码、邮箱
```

### Step 3: 检查包名是否可用

```bash
# 检查包名 @openclaw/insurance-broker-skill 是否被占用
npm view @openclaw/insurance-broker-skill

# 如果返回 404，说明可用
# 如果已被占用，修改 package.json 中的 name 字段
```

### Step 4: 发布到 npm

```bash
cd /home/justin/ai-insurance

# 确保已构建
npm run build

# 发布（首次发布使用 --access public）
npm publish --access public

# 成功后会显示：
# + @openclaw/insurance-broker-skill@0.1.0
```

### Step 5: 验证发布

```bash
# 查看发布的包
npm view @openclaw/insurance-broker-skill

# 或访问
# https://www.npmjs.com/package/@openclaw/insurance-broker-skill
```

---

## 🌐 方式二：发布到 ClawHub

### Step 1: 准备资源文件（可选，占坑可跳过）

```bash
# 创建 icon（可选）
mkdir -p assets
# 添加 512x512 的 icon.png 到 assets/

# 创建截图（可选）
mkdir -p assets/screenshots
# 添加功能截图
```

### Step 2: 验证 clawhub.json

```bash
# 检查 JSON 格式
cat clawhub.json | jq .

# 或使用在线工具验证
# https://jsonlint.com
```

### Step 3: 访问 ClawHub 发布

**方法 A: Web 界面（推荐）**

1. 访问 https://clawhub.ai/publish
2. 登录/注册账号
3. 选择 "New Skill"
4. 上传项目文件或提供 GitHub 链接
5. 填写/确认 clawhub.json 信息
6. 提交审核

**方法 B: GitHub 集成**

1. 将代码推送到 GitHub
```bash
git init
git add .
git commit -m "Initial release v0.1.0"
git remote add origin https://github.com/yourusername/insurance-broker-skill.git
git push -u origin main
```

2. 在 ClawHub 上连接 GitHub 仓库
3. 选择要发布的分支/标签
4. 自动读取 clawhub.json
5. 提交审核

**方法 C: CLI 工具**

```bash
# 安装 ClawHub CLI（如果有）
npm install -g clawhub-cli

# 登录
clawhub login

# 发布
clawhub publish

# 或指定配置文件
clawhub publish --config clawhub.json
```

### Step 4: 等待审核

- 通常 1-3 个工作日
- 审核通过后会收到邮件通知
- 可在 https://clawhub.ai/skills/insurance-broker 查看

---

## 🚀 快速发布流程（占坑版）

**最小化步骤，快速占坑：**

```bash
# 1. 确保代码可构建
cd /home/justin/ai-insurance
npm install
npm run build

# 2. 发布到 npm（占据包名）
npm login
npm publish --access public

# 3. 推送到 GitHub
git init
git add .
git commit -m "feat: initial release v0.1.0 - MVP"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# 4. 在 ClawHub 上提交（占据 Skill 名称）
# 访问 https://clawhub.ai/publish
# 连接 GitHub 仓库并提交

# ✅ 完成！名称已占坑
```

**预计时间**: 30 分钟

---

## 📝 发布后的工作

### 1. 更新项目链接

在以下文件中更新实际的 GitHub 链接：
- `package.json` - `repository.url`
- `clawhub.json` - `homepage`, `repository.url`
- `README.md` - 所有链接

### 2. 创建 GitHub Release

```bash
# 创建 tag
git tag -a v0.1.0 -m "Release v0.1.0 - Initial MVP"
git push origin v0.1.0

# 在 GitHub 上创建 Release
# 访问: https://github.com/youruser/insurance-broker-skill/releases/new
# 选择 tag: v0.1.0
# 标题: v0.1.0 - Initial Release
# 描述: 复制 CHANGELOG.md 的内容
```

### 3. 宣传推广

- [ ] 在 Discord/Slack 社区分享
- [ ] 发布到社交媒体
- [ ] 撰写介绍文章/博客
- [ ] 收集早期用户反馈

### 4. 设置监控

```bash
# 设置 npm 下载量监控
# https://www.npmjs.com/package/@openclaw/insurance-broker-skill

# 设置 GitHub 星标通知
# https://github.com/youruser/insurance-broker-skill/watchers

# 设置 ClawHub 安装量监控
# https://clawhub.ai/dashboard/skills/insurance-broker
```

---

## 🔄 后续迭代发布流程

### 发布新版本 (v0.2.0, v0.3.0, ...)

```bash
# 1. 更新版本号
npm version patch  # 0.1.0 -> 0.1.1 (bug fix)
npm version minor  # 0.1.0 -> 0.2.0 (new features)
npm version major  # 0.1.0 -> 1.0.0 (breaking changes)

# 2. 更新 CHANGELOG.md
# 添加新版本的变更记录

# 3. 更新 clawhub.json
# 修改 version 字段和 updated 时间

# 4. 构建
npm run build

# 5. 提交代码
git add .
git commit -m "chore: bump version to v0.2.0"
git push

# 6. 发布到 npm
npm publish

# 7. 创建 GitHub Release
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0

# 8. 更新 ClawHub
# 在 ClawHub 后台点击 "Update Skill"
# 或重新提交审核
```

---

## ⚠️ 常见问题

### Q1: npm 包名被占用怎么办？

**方案 A**: 使用 scope
```json
{
  "name": "@yourorg/insurance-broker-skill"
}
```

**方案 B**: 修改包名
```json
{
  "name": "openclaw-insurance-broker",
  "name": "ai-insurance-broker-skill"
}
```

### Q2: ClawHub 审核不通过？

**常见原因**:
- clawhub.json 格式错误
- 缺少必要文件 (README, LICENSE)
- 描述不清晰
- 功能不完整

**解决方案**:
- 仔细阅读审核反馈
- 修复问题后重新提交
- 联系 ClawHub 支持: support@clawhub.ai

### Q3: 构建失败？

```bash
# 检查依赖
npm install

# 检查 TypeScript 配置
npx tsc --noEmit

# 查看错误详情
npm run build 2>&1 | tee build.log
```

### Q4: 如何撤销发布？

**npm**:
```bash
# 72小时内可以撤销
npm unpublish @openclaw/insurance-broker-skill@0.1.0

# 或废弃特定版本
npm deprecate @openclaw/insurance-broker-skill@0.1.0 "请使用新版本"
```

**ClawHub**:
- 联系 ClawHub 支持
- 或在后台设置为 "unlisted"

---

## 📊 发布后数据追踪

### npm 统计

```bash
# 查看下载量
npm view @openclaw/insurance-broker-skill

# 或访问
https://npm-stat.com/charts.html?package=@openclaw/insurance-broker-skill
```

### GitHub 统计

- Stars: 收藏数
- Forks: 派生数
- Issues: 问题反馈
- Pull Requests: 代码贡献

### ClawHub 统计

- 安装量
- 活跃用户数
- 评分和评论
- 使用时长

---

## 🎉 恭喜！

现在您已经成功"占坑"并发布了 **AI 保险经纪人 Skill v0.1.0**！

**下一步**:
1. 📣 宣传项目，吸引早期用户
2. 📊 收集用户反馈
3. 💻 按照 [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) 继续开发
4. 🔄 定期发布新版本

---

**祝发布顺利！** 🚀
