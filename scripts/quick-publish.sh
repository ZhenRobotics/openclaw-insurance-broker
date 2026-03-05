#!/bin/bash

# 一键发布脚本 - Insurance Broker Skill v0.1.0
# 快速"占坑"发布到 npm 和 ClawHub

set -e

echo "🚀 Insurance Broker Skill - 快速发布工具"
echo "========================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: 检查必要文件
echo "📦 Step 1: 检查必要文件..."
required_files=("package.json" "clawhub.json" "README.md" "LICENSE" "CHANGELOG.md")
missing=0

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓ $file${NC}"
  else
    echo -e "${RED}✗ $file 不存在${NC}"
    missing=1
  fi
done

if [ $missing -eq 1 ]; then
  echo -e "${RED}缺少必要文件，请先准备完整${NC}"
  exit 1
fi

echo ""

# Step 2: 安装依赖
echo "📥 Step 2: 安装依赖..."
if command -v pnpm &> /dev/null; then
  pnpm install
elif command -v npm &> /dev/null; then
  npm install
else
  echo -e "${RED}未找到 npm 或 pnpm${NC}"
  exit 1
fi

echo ""

# Step 3: 构建项目
echo "🔨 Step 3: 构建项目..."
if command -v pnpm &> /dev/null; then
  pnpm build
else
  npm run build
fi

if [ ! -d "dist" ]; then
  echo -e "${RED}构建失败，dist 目录不存在${NC}"
  exit 1
fi

echo -e "${GREEN}✓ 构建成功${NC}"
echo ""

# Step 4: npm 发布
echo "📦 Step 4: 发布到 npm..."
echo -e "${YELLOW}准备发布到 npm...${NC}"
echo ""
echo "请确认："
echo "1. 已经登录 npm (npm login)"
echo "2. 包名 @openclaw/insurance-broker-skill 可用"
echo ""
read -p "是否继续发布到 npm? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npm publish --access public
  echo -e "${GREEN}✓ npm 发布成功！${NC}"
  echo -e "${BLUE}查看: https://www.npmjs.com/package/@openclaw/insurance-broker-skill${NC}"
else
  echo -e "${YELLOW}跳过 npm 发布${NC}"
fi

echo ""

# Step 5: Git 准备
echo "📝 Step 5: Git 准备..."
if [ ! -d ".git" ]; then
  echo "初始化 Git 仓库..."
  git init
  git add .
  git commit -m "feat: initial release v0.1.0 - MVP

- Add basic needs analysis feature
- Add 50+ insurance products database
- Add insurance knowledge Q&A
- Add multi-agent architecture
"
  echo -e "${GREEN}✓ Git 初始化完成${NC}"
else
  echo -e "${YELLOW}Git 仓库已存在${NC}"
fi

echo ""

# Step 6: GitHub 提示
echo "🌐 Step 6: 推送到 GitHub..."
echo ""
echo -e "${BLUE}接下来的步骤：${NC}"
echo ""
echo "1. 在 GitHub 上创建仓库:"
echo "   https://github.com/new"
echo "   仓库名: insurance-broker-skill"
echo ""
echo "2. 推送代码:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/insurance-broker-skill.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 创建 Release:"
echo "   git tag -a v0.1.0 -m 'Release v0.1.0'"
echo "   git push origin v0.1.0"
echo ""
read -p "按回车继续..."

echo ""

# Step 7: ClawHub 提示
echo "🎯 Step 7: 发布到 ClawHub..."
echo ""
echo -e "${BLUE}ClawHub 发布选项：${NC}"
echo ""
echo "方式 A: Web 界面（推荐）"
echo "  1. 访问: https://clawhub.ai/publish"
echo "  2. 登录/注册账号"
echo "  3. 选择 'New Skill'"
echo "  4. 连接 GitHub 仓库或上传文件"
echo "  5. 提交审核"
echo ""
echo "方式 B: CLI 工具"
echo "  npm install -g clawhub-cli"
echo "  clawhub login"
echo "  clawhub publish"
echo ""
read -p "按回车继续..."

echo ""

# 完成
echo "======================================"
echo -e "${GREEN}🎉 发布准备完成！${NC}"
echo "======================================"
echo ""
echo "✅ 已完成:"
echo "  • 文件检查"
echo "  • 依赖安装"
echo "  • 项目构建"
echo "  • npm 发布（如果选择）"
echo "  • Git 初始化"
echo ""
echo "📋 下一步:"
echo "  1. 推送代码到 GitHub"
echo "  2. 在 ClawHub 上提交 Skill"
echo "  3. 等待审核（1-3个工作日）"
echo ""
echo "📊 发布后:"
echo "  • npm: https://www.npmjs.com/package/@openclaw/insurance-broker-skill"
echo "  • ClawHub: https://clawhub.ai/skills/insurance-broker"
echo "  • GitHub: https://github.com/YOUR_USERNAME/insurance-broker-skill"
echo ""
echo -e "${BLUE}查看详细发布指南: cat PUBLISH_GUIDE.md${NC}"
echo ""
