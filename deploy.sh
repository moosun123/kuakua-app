#!/bin/bash

echo "🚀 每天夸你一万遍 - 部署脚本"
echo "=============================="

# 检查是否安装了必要工具
if ! command -v git &> /dev/null; then
    echo "❌ 请先安装 Git"
    exit 1
fi

echo ""
echo "📦 步骤1: 创建 Git 仓库"
git init
git add .
git commit -m "Initial commit: Praise App"

echo ""
echo "📋 部署选项:"
echo "1. Vercel (推荐)"
echo "2. GitHub Pages"
echo "3. 退出"
echo ""
read -p "请选择 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Vercel 部署步骤:"
        echo "1. 访问 https://vercel.com 并登录"
        echo "2. 点击 'Add New Project'"
        echo "3. 导入此 GitHub 仓库"
        echo "4. 点击 Deploy"
        echo ""
        echo "📱 部署完成后，手机访问链接即可使用！"
        ;;
    2)
        echo ""
        echo "🐙 GitHub Pages 部署步骤:"
        echo "1. 在 GitHub 创建新仓库 (如 praise-app)"
        echo "2. 运行以下命令:"
        echo "   git remote add origin https://github.com/你的用户名/praise-app.git"
        echo "   git push -u origin main"
        echo "3. 进入仓库 Settings → Pages"
        echo "4. Source 选择 main 分支，保存"
        echo ""
        echo "📱 等待1-2分钟后访问 https://你的用户名.github.io/praise-app"
        ;;
    3)
        echo "已退出"
        exit 0
        ;;
    *)
        echo "无效选择"
        exit 1
        ;;
esac

echo ""
echo "✅ 准备就绪！"
echo "💡 提示: 部署后用手机浏览器打开，添加到主屏幕即可获得最佳体验"
