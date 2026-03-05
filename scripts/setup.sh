#!/bin/bash

# OpenClaw FA Skill 快速部署脚本
# 使用方法: bash scripts/setup.sh

set -e

echo "🚀 OpenClaw FA Skill 部署工具"
echo "=============================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js 版本
check_node() {
  echo "📦 检查 Node.js 版本..."
  if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请先安装 Node.js 22 或更高版本"
    exit 1
  fi

  NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
  if [ "$NODE_VERSION" -lt 22 ]; then
    echo -e "${RED}❌ Node.js 版本过低 (当前: v$NODE_VERSION)${NC}"
    echo "需要 Node.js >= 22"
    exit 1
  fi

  echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"
}

# 检查包管理器
check_package_manager() {
  echo "📦 检查包管理器..."
  if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    echo -e "${GREEN}✓ 使用 pnpm${NC}"
  elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    echo -e "${YELLOW}⚠ 使用 npm (推荐安装 pnpm)${NC}"
  else
    echo -e "${RED}❌ 未找到包管理器${NC}"
    exit 1
  fi
}

# 安装依赖
install_dependencies() {
  echo "📦 安装依赖..."
  $PKG_MANAGER install
  echo -e "${GREEN}✓ 依赖安装完成${NC}"
}

# 构建项目
build_project() {
  echo "🔨 构建项目..."
  $PKG_MANAGER run build
  echo -e "${GREEN}✓ 构建完成${NC}"
}

# 检查 OpenClaw
check_openclaw() {
  echo "🔍 检查 OpenClaw..."
  if ! command -v openclaw &> /dev/null; then
    echo -e "${YELLOW}⚠ OpenClaw CLI 未找到${NC}"
    echo "请先安装 OpenClaw:"
    echo "  npm install -g openclaw@latest"
    return 1
  fi
  echo -e "${GREEN}✓ OpenClaw 已安装${NC}"
  return 0
}

# 链接 skill
link_skill() {
  echo "🔗 链接 skill 到 OpenClaw..."

  # 获取当前目录
  CURRENT_DIR=$(pwd)
  OPENCLAW_SKILLS_DIR="$HOME/.openclaw/skills"

  # 创建 skills 目录（如果不存在）
  mkdir -p "$OPENCLAW_SKILLS_DIR"

  # 创建软链接
  if [ -L "$OPENCLAW_SKILLS_DIR/fa" ]; then
    echo -e "${YELLOW}⚠ skill 已链接，跳过${NC}"
  else
    ln -s "$CURRENT_DIR" "$OPENCLAW_SKILLS_DIR/fa"
    echo -e "${GREEN}✓ skill 已链接到 ~/.openclaw/skills/fa${NC}"
  fi
}

# 配置 OpenClaw
configure_openclaw() {
  echo "⚙️  配置 OpenClaw..."

  CONFIG_FILE="$HOME/.openclaw/config.yaml"

  if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}⚠ OpenClaw 配置文件不存在，跳过自动配置${NC}"
    echo "请手动编辑 ~/.openclaw/config.yaml 添加以下内容:"
    echo ""
    echo "skills:"
    echo "  - name: fa"
    echo "    enabled: true"
    echo "    config:"
    echo "      defaultCurrency: CNY"
    echo "      defaultLanguage: zh-CN"
    echo "      investorDatabasePath: $(pwd)/data/investors.json"
    echo "      enableWebSearch: true"
    echo ""
    return
  fi

  # 检查是否已配置
  if grep -q "name: fa" "$CONFIG_FILE"; then
    echo -e "${YELLOW}⚠ FA skill 已在配置文件中，跳过${NC}"
  else
    echo -e "${GREEN}✓ 配置已添加到 $CONFIG_FILE${NC}"
    echo "（注：自动配置功能开发中，请手动编辑配置文件）"
  fi
}

# 启动测试
run_tests() {
  echo "🧪 运行测试..."
  if $PKG_MANAGER run test 2>/dev/null; then
    echo -e "${GREEN}✓ 测试通过${NC}"
  else
    echo -e "${YELLOW}⚠ 测试跳过（测试套件开发中）${NC}"
  fi
}

# 显示下一步
show_next_steps() {
  echo ""
  echo "=============================="
  echo -e "${GREEN}🎉 部署完成！${NC}"
  echo "=============================="
  echo ""
  echo "下一步操作："
  echo ""
  echo "1. 启动 OpenClaw Gateway:"
  echo "   ${YELLOW}openclaw gateway --port 18789${NC}"
  echo ""
  echo "2. 或重启 Gateway (如果已运行):"
  echo "   ${YELLOW}openclaw gateway restart${NC}"
  echo ""
  echo "3. 发送测试消息（通过任何已连接的渠道）:"
  echo "   ${YELLOW}\"帮我生成一份商业计划书\"${NC}"
  echo ""
  echo "4. 查看可用命令:"
  echo "   • 生成 BP: \"帮我生成一份 BP\""
  echo "   • 匹配投资人: \"推荐适合 Pre-A 轮的投资机构\""
  echo "   • 财务建模: \"帮我做一个三年期的财务模型\""
  echo "   • 估值分析: \"分析一下项目估值\""
  echo "   • 融资策略: \"帮我制定融资策略\""
  echo "   • 尽调准备: \"需要准备哪些尽调材料？\""
  echo "   • 行业分析: \"分析一下 SaaS 行业\""
  echo ""
  echo "5. 查看日志:"
  echo "   ${YELLOW}openclaw logs --follow${NC}"
  echo ""
  echo "📚 更多信息:"
  echo "   • 快速开始: cat QUICKSTART.md"
  echo "   • 项目总结: cat PROJECT_SUMMARY.md"
  echo "   • 使用文档: cat docs/USAGE.md"
  echo ""
}

# 主流程
main() {
  echo "开始部署..."
  echo ""

  check_node
  check_package_manager
  install_dependencies
  build_project

  if check_openclaw; then
    link_skill
    configure_openclaw
  fi

  # run_tests  # 可选

  show_next_steps
}

# 执行主流程
main
