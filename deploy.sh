#!/bin/bash

# 1ucoin.fun Vercel 部署脚本
# 使用方法: bash deploy.sh

set -e

echo "🚀 1ucoin.fun Vercel 部署脚本"
echo "================================"

# 检查是否安装了 vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
echo ""
echo "🔐 检查 Vercel 登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "📝 请登录 Vercel..."
    vercel login
fi

# 清理旧的构建文件
echo ""
echo "🧹 清理旧的构建文件..."
rm -rf dist node_modules/.vite

# 安装依赖
echo ""
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo ""
echo "🔨 构建项目..."
pnpm build

# 验证构建
if [ ! -d "dist" ]; then
    echo "❌ 构建失败：dist 目录不存在"
    exit 1
fi

echo ""
echo "✅ 构建成功"

# 部署到 Vercel
echo ""
echo "🌐 部署到 Vercel..."
echo ""
echo "选择部署选项："
echo "1) 部署到预览环境（推荐测试）"
echo "2) 部署到生产环境"
echo ""
read -p "请选择 (1 或 2): " choice

case $choice in
    1)
        echo "📤 部署到预览环境..."
        vercel
        ;;
    2)
        echo "📤 部署到生产环境..."
        vercel --prod
        ;;
    *)
        echo "❌ 无效的选择"
        exit 1
        ;;
esac

echo ""
echo "✅ 部署完成！"
echo ""
echo "📋 后续步骤："
echo "1. 访问 https://vercel.com/dashboard 查看部署状态"
echo "2. 配置自定义域名（如需要）"
echo "3. 在 Vercel 中启用 Analytics"
echo ""
echo "🎉 您的网站已上线！"
