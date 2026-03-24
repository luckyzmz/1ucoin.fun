#!/bin/bash

# 1ucoin.fun Vercel 预构建部署脚本
# 这个脚本将本地构建的 node_modules 提交到 GitHub，然后部署到 Vercel

set -e

echo "🚀 1ucoin.fun Vercel 预构建部署"
echo "================================"

# 步骤 1：清除旧的 node_modules
echo ""
echo "🧹 清除旧的 node_modules..."
rm -rf node_modules

# 步骤 2：重新安装依赖
echo ""
echo "📦 安装依赖..."
pnpm install

# 步骤 3：验证安装
echo ""
echo "✅ 验证安装..."
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules 目录不存在"
    exit 1
fi

echo "✅ node_modules 已安装"
echo "📊 大小: $(du -sh node_modules | cut -f1)"

# 步骤 4：本地测试构建
echo ""
echo "🔨 本地测试构建..."
pnpm build

if [ ! -d "dist" ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 步骤 5：提交到 Git
echo ""
echo "📝 提交到 Git..."
git add node_modules pnpm-lock.yaml .npmrc .gitignore vercel.json
git commit -m "Add prebuilt node_modules for Vercel deployment" || echo "⚠️  没有新的更改需要提交"

# 步骤 6：推送到 GitHub
echo ""
echo "📤 推送到 GitHub..."
echo "⏳ 这可能需要 5-15 分钟，请耐心等待..."
git push origin main

echo ""
echo "✅ 推送完成"

# 步骤 7：提示用户
echo ""
echo "================================"
echo "🎉 部署准备完成！"
echo "================================"
echo ""
echo "后续步骤："
echo "1. 进入 https://vercel.com/dashboard"
echo "2. 选择您的 1ucoin 项目"
echo "3. 进入 'Deployments' 标签"
echo "4. 找到失败的部署，点击菜单 → 'Redeploy'"
echo ""
echo "预期结果："
echo "✓ 构建时间 < 1 分钟"
echo "✓ 网站成功上线"
echo ""
