# 📦 发布步骤 - Insurance Broker

## 当前 Git 配置

✅ **已配置完成**：
- 远程仓库: `git@github.com:ZhenRobotics/openclaw-insurance-broker.git`
- 分支: `main`
- 用户: ZhenRobotics

---

## 🚀 方式一：使用自动脚本（推荐）

```bash
cd /home/justin/openclaw-insurance-broker

# 添加执行权限
chmod +x publish-to-github.sh

# 运行脚本
./publish-to-github.sh
```

脚本会自动：
1. ✅ 检查 git 状态
2. ✅ 添加文件到暂存区
3. ✅ 创建提交
4. ✅ 推送到 GitHub
5. ✅ 创建 v0.1.0 标签

---

## 🔧 方式二：手动执行

```bash
cd /home/justin/openclaw-insurance-broker

# 1. 查看状态
git status

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "feat: initial release v0.1.0 - Insurance Broker Skill

AI 保险经纪人 v0.1.0 MVP 版本

功能：
- 保险需求分析
- 智能产品推荐（基础）
- 保险知识问答
- 50+ 产品数据库

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 4. 推送到 GitHub
git push -u origin main

# 5. 创建标签（可选）
git tag -a v0.1.0 -m "Release v0.1.0 - Initial MVP"
git push origin v0.1.0
```

---

## 📋 发布后步骤

### 1. 验证 GitHub 发布

访问：https://github.com/ZhenRobotics/openclaw-insurance-broker

检查：
- ✅ 代码已推送
- ✅ README.md 显示正常
- ✅ 标签 v0.1.0 已创建

### 2. 创建 GitHub Release（推荐）

1. 访问：https://github.com/ZhenRobotics/openclaw-insurance-broker/releases/new
2. 选择标签：`v0.1.0`
3. Release 标题：`v0.1.0 - Initial MVP Release`
4. 描述：复制 `CHANGELOG.md` 的内容
5. 点击 "Publish release"

### 3. 发布到 ClawHub

1. **访问**: https://clawhub.ai/publish

2. **登录**: 使用 GitHub 账号登录

3. **导入仓库**:
   - 选择 "Import from GitHub"
   - 选择仓库: `ZhenRobotics/openclaw-insurance-broker`
   - 分支: `main`
   - 标签: `v0.1.0`

4. **确认配置**:
   - ClawHub 会自动读取 `clawhub.json`
   - 检查所有信息是否正确

5. **提交审核**:
   - 点击 "Submit for Review"
   - 等待审核（1-3 个工作日）

### 4. 发布到 npm（可选）

如果还想发布到 npm：

```bash
cd /home/justin/openclaw-insurance-broker

# 登录 npm
npm login

# 发布
npm publish
```

包名：`insurance-broker`

---

## 📊 发布后的链接

发布成功后，您的项目将在以下位置可见：

- 🐙 **GitHub**: https://github.com/ZhenRobotics/openclaw-insurance-broker
- 🌐 **ClawHub**: https://clawhub.ai/skills/insurance-broker
- 📦 **npm**: https://www.npmjs.com/package/insurance-broker（如果发布）

---

## ✅ 检查清单

在发布前确认：

- [x] 代码已构建（`npm run build` 成功）
- [x] `package.json` 配置正确（name: insurance-broker）
- [x] `clawhub.json` 配置正确
- [x] `README.md` 完整
- [x] `LICENSE` 存在
- [x] `CHANGELOG.md` 更新
- [x] Git 远程仓库已配置
- [ ] 代码已推送到 GitHub
- [ ] 已在 ClawHub 提交审核

---

## 🆘 遇到问题？

### SSH Key 问题

如果推送时提示权限问题：

```bash
# 检查 SSH key
ssh -T git@github.com

# 如果需要添加 SSH key，访问：
# https://github.com/settings/keys
```

### 推送失败

```bash
# 拉取最新代码
git pull origin main --rebase

# 再次推送
git push origin main
```

---

**准备好了吗？运行脚本开始发布！** 🚀

```bash
cd /home/justin/openclaw-insurance-broker
chmod +x publish-to-github.sh
./publish-to-github.sh
```
