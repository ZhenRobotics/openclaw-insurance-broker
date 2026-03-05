#!/bin/bash

# Insurance Broker - GitHub 发布脚本
# 基于当前 git 配置: git@github.com:ZhenRobotics/openclaw-insurance-broker.git

set -e

echo "🚀 Insurance Broker - GitHub 发布脚本"
echo "====================================="
echo ""
echo "📍 远程仓库: git@github.com:ZhenRobotics/openclaw-insurance-broker.git"
echo ""

# 切换到项目目录
cd /home/justin/openclaw-insurance-broker

# 1. 检查 git 状态
echo "📋 Step 1: 检查 git 状态..."
git status

echo ""
read -p "是否要添加所有文件到暂存区？(y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "➕ 添加文件到暂存区..."
    git add .
    echo "✅ 文件已添加"
fi

# 2. 检查是否有未提交的更改
echo ""
echo "📋 Step 2: 检查是否有未提交的更改..."
if git diff-index --quiet HEAD --; then
    echo "ℹ️  没有需要提交的更改"
else
    echo "📝 有未提交的更改，准备提交..."
    echo ""
    echo "请输入提交信息（或按 Enter 使用默认信息）:"
    read -r commit_message

    if [ -z "$commit_message" ]; then
        commit_message="feat: initial release v0.1.0 - Insurance Broker Skill

AI 保险经纪人 v0.1.0 MVP 版本

功能：
- 保险需求分析
- 智能产品推荐（基础）
- 保险知识问答
- 50+ 产品数据库

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
    fi

    git commit -m "$commit_message"
    echo "✅ 提交成功"
fi

# 3. 推送到 GitHub
echo ""
echo "📋 Step 3: 推送到 GitHub..."
echo "目标: git@github.com:ZhenRobotics/openclaw-insurance-broker.git"
echo ""
read -p "确认推送到 GitHub? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⬆️  推送中..."
    git push -u origin main
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "🎉 代码已发布到 GitHub！"
    echo "🔗 查看仓库: https://github.com/ZhenRobotics/openclaw-insurance-broker"
else
    echo "❌ 取消推送"
    exit 0
fi

# 4. 创建 release tag
echo ""
echo "📋 Step 4: 创建 v0.1.0 标签（可选）"
read -p "是否创建 v0.1.0 release 标签? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🏷️  创建标签..."
    git tag -a v0.1.0 -m "Release v0.1.0 - Initial MVP

AI 保险经纪人首个 MVP 版本
- 基础需求分析功能
- 50+ 产品数据库
- 保险知识问答"

    git push origin v0.1.0
    echo "✅ 标签已推送"
    echo ""
    echo "🔗 创建 GitHub Release: https://github.com/ZhenRobotics/openclaw-insurance-broker/releases/new?tag=v0.1.0"
fi

echo ""
echo "================================"
echo "✅ GitHub 发布完成！"
echo ""
echo "📦 下一步: 发布到 ClawHub"
echo "1. 访问: https://clawhub.ai/publish"
echo "2. 选择 'Import from GitHub'"
echo "3. 选择仓库: ZhenRobotics/openclaw-insurance-broker"
echo "4. 提交审核"
echo ""
echo "🎯 占坑成功！"
echo "================================"
