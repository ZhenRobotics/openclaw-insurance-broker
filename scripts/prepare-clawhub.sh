#!/bin/bash

# ClawHub 发布准备脚本
# 使用方法: bash scripts/prepare-clawhub.sh

set -e

echo "🚀 ClawHub 发布准备工具"
echo "=============================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查必需文件
check_files() {
  echo "📦 检查必需文件..."

  local missing=0

  if [ ! -f "clawhub.json" ]; then
    echo -e "${RED}❌ clawhub.json 不存在${NC}"
    missing=1
  else
    echo -e "${GREEN}✓ clawhub.json${NC}"
  fi

  if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json 不存在${NC}"
    missing=1
  else
    echo -e "${GREEN}✓ package.json${NC}"
  fi

  if [ ! -f "README.md" ]; then
    echo -e "${RED}❌ README.md 不存在${NC}"
    missing=1
  else
    echo -e "${GREEN}✓ README.md${NC}"
  fi

  if [ ! -f "LICENSE" ]; then
    echo -e "${RED}❌ LICENSE 不存在${NC}"
    missing=1
  else
    echo -e "${GREEN}✓ LICENSE${NC}"
  fi

  if [ ! -d "dist" ]; then
    echo -e "${YELLOW}⚠ dist/ 目录不存在，需要构建${NC}"
    missing=1
  else
    echo -e "${GREEN}✓ dist/${NC}"
  fi

  if [ $missing -eq 1 ]; then
    echo -e "${RED}缺少必需文件，请先完成准备工作${NC}"
    return 1
  fi

  echo ""
  return 0
}

# 验证 clawhub.json
validate_config() {
  echo "🔍 验证 clawhub.json..."

  if command -v jq &> /dev/null; then
    if jq empty clawhub.json 2>/dev/null; then
      echo -e "${GREEN}✓ clawhub.json 格式正确${NC}"
    else
      echo -e "${RED}❌ clawhub.json 格式错误${NC}"
      return 1
    fi
  else
    echo -e "${YELLOW}⚠ jq 未安装，跳过 JSON 验证${NC}"
  fi

  echo ""
  return 0
}

# 构建项目
build_project() {
  echo "🔨 构建项目..."

  if [ ! -d "dist" ]; then
    if command -v pnpm &> /dev/null; then
      pnpm build
    elif command -v npm &> /dev/null; then
      npm run build
    else
      echo -e "${RED}❌ 未找到 pnpm 或 npm${NC}"
      return 1
    fi
    echo -e "${GREEN}✓ 构建完成${NC}"
  else
    echo -e "${YELLOW}⚠ dist/ 已存在，跳过构建${NC}"
    echo -e "${BLUE}💡 如需重新构建，请先删除 dist/ 目录${NC}"
  fi

  echo ""
  return 0
}

# 检查资源文件
check_assets() {
  echo "🎨 检查资源文件..."

  mkdir -p assets/screenshots

  local warnings=0

  if [ ! -f "assets/icon.png" ]; then
    echo -e "${YELLOW}⚠ assets/icon.png 不存在${NC}"
    echo -e "${BLUE}💡 建议创建 512x512 的 PNG 图标${NC}"
    warnings=1
  else
    echo -e "${GREEN}✓ assets/icon.png${NC}"
  fi

  if [ ! -f "assets/screenshots/bp-generation.png" ]; then
    echo -e "${YELLOW}⚠ BP 生成截图不存在${NC}"
    warnings=1
  else
    echo -e "${GREEN}✓ BP 生成截图${NC}"
  fi

  if [ ! -f "assets/screenshots/investor-matching.png" ]; then
    echo -e "${YELLOW}⚠ 投资人匹配截图不存在${NC}"
    warnings=1
  else
    echo -e "${GREEN}✓ 投资人匹配截图${NC}"
  fi

  if [ ! -f "assets/screenshots/financial-model.png" ]; then
    echo -e "${YELLOW}⚠ 财务模型截图不存在${NC}"
    warnings=1
  else
    echo -e "${GREEN}✓ 财务模型截图${NC}"
  fi

  if [ $warnings -gt 0 ]; then
    echo ""
    echo -e "${BLUE}💡 资源文件是可选的，但强烈建议提供${NC}"
    echo -e "${BLUE}💡 查看 CLAWHUB_PUBLISH.md 了解如何准备资源${NC}"
  fi

  echo ""
  return 0
}

# 生成发布包
create_package() {
  echo "📦 生成发布包..."

  local PACKAGE_NAME="fa-skill-v$(cat package.json | grep '"version"' | cut -d'"' -f4).tar.gz"

  echo "正在打包..."

  tar -czf "$PACKAGE_NAME" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    dist/ \
    data/ \
    clawhub.json \
    package.json \
    README.md \
    LICENSE \
    assets/ 2>/dev/null || true

  if [ -f "$PACKAGE_NAME" ]; then
    echo -e "${GREEN}✓ 发布包已生成: $PACKAGE_NAME${NC}"
    ls -lh "$PACKAGE_NAME"
  else
    echo -e "${RED}❌ 发布包生成失败${NC}"
    return 1
  fi

  echo ""
  return 0
}

# 显示发布检查清单
show_checklist() {
  echo "=============================="
  echo -e "${GREEN}✅ 发布检查清单${NC}"
  echo "=============================="
  echo ""

  echo "必需项："
  echo "  ✓ clawhub.json 已创建"
  echo "  ✓ package.json 已配置"
  echo "  ✓ README.md 已完善"
  echo "  ✓ LICENSE 文件存在"
  echo "  ✓ 项目已构建（dist/）"
  echo ""

  echo "推荐项（可选）："
  if [ -f "assets/icon.png" ]; then
    echo "  ✓ 图标已准备"
  else
    echo "  ⚠ 图标未准备（建议添加）"
  fi

  local screenshot_count=0
  [ -f "assets/screenshots/bp-generation.png" ] && screenshot_count=$((screenshot_count+1))
  [ -f "assets/screenshots/investor-matching.png" ] && screenshot_count=$((screenshot_count+1))
  [ -f "assets/screenshots/financial-model.png" ] && screenshot_count=$((screenshot_count+1))

  if [ $screenshot_count -ge 3 ]; then
    echo "  ✓ 截图已准备（$screenshot_count 张）"
  else
    echo "  ⚠ 截图未完整（建议至少 3 张）"
  fi

  echo ""
}

# 显示下一步操作
show_next_steps() {
  echo "=============================="
  echo -e "${BLUE}📝 下一步操作${NC}"
  echo "=============================="
  echo ""

  echo "1️⃣  准备资源文件（如需要）："
  echo "   ${YELLOW}• 创建 assets/icon.png (512x512)${NC}"
  echo "   ${YELLOW}• 创建截图（3-5 张）${NC}"
  echo ""

  echo "2️⃣  访问 ClawHub.ai 发布："
  echo "   ${BLUE}https://clawhub.ai/publish${NC}"
  echo ""

  echo "3️⃣  选择发布方式："
  echo "   • Web 界面上传（推荐）"
  echo "   • GitHub 集成"
  echo "   • CLI 工具"
  echo ""

  echo "4️⃣  详细发布指南："
  echo "   ${BLUE}cat CLAWHUB_PUBLISH.md${NC}"
  echo ""

  echo "5️⃣  如有问题："
  echo "   • 查看 FAQ.md"
  echo "   • 访问 https://clawhub.ai/docs"
  echo "   • 联系 support@clawhub.ai"
  echo ""
}

# 主流程
main() {
  echo "开始检查..."
  echo ""

  # 检查必需文件
  if ! check_files; then
    exit 1
  fi

  # 验证配置
  if ! validate_config; then
    exit 1
  fi

  # 构建项目
  if ! build_project; then
    exit 1
  fi

  # 检查资源
  check_assets

  # 生成发布包（可选）
  echo "是否生成发布包？(y/n)"
  read -r response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    create_package
  fi

  # 显示检查清单
  show_checklist

  # 显示下一步
  show_next_steps

  echo "=============================="
  echo -e "${GREEN}🎉 准备完成！${NC}"
  echo "=============================="
}

# 执行主流程
main
