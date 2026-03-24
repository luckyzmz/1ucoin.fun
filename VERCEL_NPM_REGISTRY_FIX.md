# Vercel 部署 - npm 注册表连接问题完整解决方案

## 问题根因

您遇到的 `ERR_INVALID_THIS` 错误是因为 Vercel 构建环境无法稳定连接到 npm 官方注册表。这在某些地区或网络条件下很常见。

## 解决方案（按推荐顺序）

### 方案 1：使用 pnpm 本地缓存 + 国内镜像（最推荐）

这是最稳定的方案，结合了本地缓存和国内镜像的优势。

#### 步骤 1：确保 pnpm-lock.yaml 已提交

```bash
cd /path/to/your/project

# 检查 pnpm-lock.yaml 是否存在
ls -la pnpm-lock.yaml

# 如果存在，确保已提交到 Git
git add pnpm-lock.yaml
git commit -m "Ensure pnpm-lock.yaml is committed"
```

#### 步骤 2：使用国内 npm 镜像

`.npmrc` 文件已配置为使用 npmmirror（原 taobao 镜像）：

```
registry=https://registry.npmmirror.com
```

#### 步骤 3：推送到 GitHub

```bash
# 提交所有更改
git add .npmrc
git commit -m "Use npmmirror registry for better stability"
git push origin main
```

#### 步骤 4：在 Vercel 中重新部署

1. 进入 https://vercel.com/dashboard
2. 选择您的项目
3. 进入 "Deployments"
4. 找到失败的部署，点击菜单 → "Redeploy"

### 方案 2：使用 Vercel 官方 npm 镜像

Vercel 提供了自己的 npm 镜像，通常更快：

编辑 `.npmrc`：

```
registry=https://npm.vercel.com
```

然后推送并重新部署。

### 方案 3：清除 Vercel 缓存并使用备选镜像

如果上述方案仍然不行：

1. 进入项目 Settings
2. 找到 "Build Cache"
3. 点击 "Clear All"
4. 编辑 `.npmrc` 改为：

```
registry=https://registry.npmjs.org/
fetch-timeout=120000
fetch-retry-mintimeout=30000
fetch-retry-maxtimeout=180000
fetch-retries=10
```

5. 推送并重新部署

### 方案 4：使用 Vercel 的 Serverless 函数缓存

在 `vercel.json` 中添加：

```json
{
  "buildCommand": "pnpm install --prefer-offline && pnpm build",
  "crons": []
}
```

### 方案 5：使用 GitHub Actions 预构建（高级）

创建 `.github/workflows/build.yml`：

```yaml
name: Pre-build for Vercel

on:
  push:
    branches: [main]

jobs:
  build:
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
      
      - name: Build
        run: pnpm build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

## 当前配置说明

您的项目已配置了以下优化：

### .npmrc 配置

```
registry=https://registry.npmmirror.com    # 国内镜像
shamefully-hoist=true                      # 提升依赖
strict-peer-dependencies=false             # 放宽对等依赖
fetch-timeout=120000                       # 120 秒超时
fetch-retry-mintimeout=30000               # 最小重试间隔
fetch-retry-maxtimeout=180000              # 最大重试间隔
fetch-retries=10                           # 重试 10 次
prefer-offline=true                        # 优先使用缓存
prefer-frozen-lockfile=true                # 使用冻结的锁定文件
```

### vercel.json 配置

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": "dist",
  "rewrites": [...]
}
```

## 验证部署成功

### 检查构建日志

1. 进入 Vercel 仪表板
2. 选择部署
3. 查看 "Build Logs"
4. 查找以下成功标志：

```
✓ Installed dependencies
✓ Running "build" command: pnpm build
✓ Build completed successfully
```

### 访问网站

- 预览 URL：`https://your-project.vercel.app`
- 自定义域名：`https://1ucoin.fun`

## 如果仍然失败

### 步骤 1：检查本地构建

```bash
# 清除本地缓存
rm -rf node_modules
rm pnpm-lock.yaml

# 重新安装
pnpm install

# 测试构建
pnpm build

# 测试预览
pnpm preview
```

### 步骤 2：更新依赖

```bash
# 更新所有依赖到最新版本
pnpm update

# 重新生成锁定文件
pnpm install

# 提交更改
git add pnpm-lock.yaml package.json
git commit -m "Update dependencies"
git push origin main
```

### 步骤 3：使用 Vercel CLI 本地测试

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 本地测试构建
vercel build

# 本地预览
vercel preview
```

## npm 镜像对比

| 镜像 | URL | 优势 | 劣势 |
|-----|-----|------|------|
| 官方 | https://registry.npmjs.org | 最新包 | 连接不稳定 |
| npmmirror | https://registry.npmmirror.com | 国内快速 | 可能延迟同步 |
| Vercel | https://npm.vercel.com | 为 Vercel 优化 | 功能可能受限 |
| 淘宝（旧） | https://registry.taobao.org | 历史稳定 | 已停止维护 |

## 推荐配置组合

### 对于中国用户

```
registry=https://registry.npmmirror.com
```

### 对于其他地区

```
registry=https://registry.npmjs.org/
fetch-timeout=120000
fetch-retries=10
```

### 对于最大稳定性

```
registry=https://npm.vercel.com
```

## 故障排查流程图

```
部署失败 (ERR_INVALID_THIS)
    ↓
方案 1: 使用 npmmirror 镜像
    ↓ (如果仍失败)
方案 2: 清除 Vercel 缓存
    ↓ (如果仍失败)
方案 3: 本地测试构建
    ↓ (如果本地成功)
方案 4: 使用 Vercel CLI 部署
    ↓ (如果仍失败)
方案 5: 联系 Vercel 支持
```

## 获取帮助

### Vercel 官方资源

- 文档：https://vercel.com/docs
- npm 配置：https://vercel.com/docs/build-output-api/v3#environment-variables
- 支持：https://vercel.com/support

### npm 镜像资源

- npmmirror：https://npmmirror.com
- npm 官方：https://npmjs.com

### 项目相关

- GitHub Issues：提交问题
- 社区论坛：https://vercel.com/support

## 总结

**最快的解决方案**：
1. 确保 `pnpm-lock.yaml` 已提交
2. 使用 `.npmrc` 中的 npmmirror 镜像
3. 在 Vercel 中重新部署

**预期结果**：
- ✅ 部署成功
- ✅ 构建时间缩短
- ✅ 网站上线

---

**如果这个方案仍然不行，请提供以下信息**：
1. 完整的构建日志
2. 您所在的地区
3. 是否可以在本地成功构建
