# 预构建指南 - 本地化依赖到 Git

由于 Vercel 美国东部环境无法连接到任何 npm 镜像，最有效的解决方案是将 `node_modules` 预构建并提交到 Git。

## 方案说明

这个方案将完全绕过 npm 注册表连接问题：

1. **本地构建**：在您的电脑上运行 `pnpm install`
2. **提交到 Git**：将 `node_modules` 提交到 GitHub
3. **Vercel 直接使用**：Vercel 不需要下载任何包，直接使用本地的 node_modules

## 操作步骤

### 步骤 1：在本地构建依赖

```bash
# 进入项目目录
cd /path/to/1ucoin-homepage

# 清除旧的 node_modules（如果存在）
rm -rf node_modules

# 重新安装依赖（使用官方 npm 注册表）
pnpm install

# 验证安装成功
pnpm list | head -20
```

### 步骤 2：更新 .gitignore（移除 node_modules 忽略）

编辑 `.gitignore` 文件，**注释掉或删除** 以下行：

```
# 注释掉这一行
# node_modules/

# 或者删除整行
```

### 步骤 3：提交到 Git

```bash
# 检查 node_modules 大小
du -sh node_modules

# 添加到 Git（这会很大，可能需要几分钟）
git add node_modules pnpm-lock.yaml .npmrc

# 提交
git commit -m "Add prebuilt node_modules for Vercel deployment"

# 推送到 GitHub（这会很慢，请耐心等待）
git push origin main
```

### 步骤 4：更新 Vercel 配置

编辑 `vercel.json`：

```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install --offline",
  "framework": "vite",
  "outputDirectory": "dist"
}
```

关键改变：`"installCommand": "pnpm install --offline"` - 这告诉 pnpm 使用本地缓存，不连接网络。

### 步骤 5：在 Vercel 中重新部署

1. 进入 https://vercel.com/dashboard
2. 选择您的项目
3. 进入 "Deployments"
4. 找到失败的部署
5. 点击菜单 → "Redeploy"

现在 Vercel 应该会：
- 跳过 `pnpm install`（因为 node_modules 已存在）
- 直接运行 `pnpm build`
- 构建应该在 30-60 秒内完成

## 文件大小参考

- `node_modules/` 大小：约 800MB - 1.2GB
- 上传到 GitHub 时间：5-15 分钟（取决于网络）
- Vercel 克隆时间：减少到 10-20 秒

## 优缺点

### 优点
- ✅ 完全避免 npm 网络问题
- ✅ 构建速度极快（30-60 秒）
- ✅ 100% 可靠（不依赖网络）
- ✅ 适合 Vercel 美国东部环境

### 缺点
- ❌ Git 仓库会变得很大（1GB+）
- ❌ 上传到 GitHub 需要时间
- ❌ 每次更新依赖都需要重新上传

## 如果 Git 推送太慢

如果 `git push` 花费太长时间，可以：

```bash
# 使用 Git LFS（Large File Storage）
git lfs install
git lfs track "node_modules/**"
git add .gitattributes
git commit -m "Add Git LFS for node_modules"
git push origin main
```

## 备选方案：使用 GitHub Actions 预构建

如果不想提交 node_modules，可以使用 GitHub Actions 在云端预构建：

创建 `.github/workflows/prebuild.yml`：

```yaml
name: Prebuild for Vercel

on:
  push:
    branches: [main]

jobs:
  prebuild:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Commit node_modules
        run: |
          git config user.email "github-actions@example.com"
          git config user.name "GitHub Actions"
          git add node_modules pnpm-lock.yaml
          git commit -m "Auto: Update node_modules" || true
          git push
```

## 验证部署

部署完成后，检查 Vercel 日志：

```
✓ Installed dependencies (using cache)
✓ Running "build" command: pnpm build
✓ Build completed in 45s
```

## 获取帮助

如果仍然失败：

1. **检查本地构建**：
   ```bash
   pnpm build
   pnpm preview
   ```

2. **检查 Git 状态**：
   ```bash
   git status
   git log --oneline | head -5
   ```

3. **清除 Vercel 缓存**：
   - 进入项目 Settings
   - Build Cache → Clear All
   - 重新部署

## 总结

这个方案是最可靠的解决方式，特别是对于 Vercel 美国东部环境。虽然 Git 仓库会变大，但构建速度和可靠性的提升是值得的。

---

**预期结果**：
- ✅ Vercel 部署成功
- ✅ 构建时间 < 1 分钟
- ✅ 网站上线
