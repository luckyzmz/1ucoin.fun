# Vercel 构建问题排查指南

## 问题描述

在 Vercel 自动部署时，您看到以下错误：

```
WARN  GET https://registry.npmjs.org/... error (ERR_INVALID_THIS). Will retry in 10 seconds.
```

这表示 Vercel 构建环境无法连接到 npm 注册表。

## 问题原因

这不是您的代码问题，而是以下原因之一：

1. **npm 注册表临时故障** - npm 服务器暂时不可用
2. **网络连接问题** - Vercel 构建环境的网络问题
3. **npm 注册表速率限制** - 过多请求被限制
4. **DNS 解析问题** - 无法解析 registry.npmjs.org

## 解决方案

### 方案 1：等待自动重试（最简单）

pnpm 会自动重试 3 次，通常第 2-3 次会成功。您可以：

1. 进入 Vercel 仪表板
2. 查看部署日志
3. 等待构建完成（通常需要 5-10 分钟）

**成功标志**：
```
✓ Build completed successfully
```

### 方案 2：在 Vercel 中重新部署

如果第一次部署失败，可以手动重新部署：

1. 进入 https://vercel.com/dashboard
2. 选择您的 1ucoin 项目
3. 进入 "Deployments" 标签
4. 找到失败的部署
5. 点击三点菜单 → "Redeploy"

### 方案 3：使用 npm 镜像加速

如果问题持续存在，可以配置 npm 镜像。创建 `.npmrc` 文件：

```bash
# 在项目根目录创建 .npmrc 文件
cat > .npmrc << 'EOF'
registry=https://registry.npmjs.org/
EOF
```

或使用国内镜像（如果在中国）：

```bash
cat > .npmrc << 'EOF'
registry=https://registry.npmmirror.com
EOF
```

然后推送到 GitHub：

```bash
git add .npmrc
git commit -m "Add npm registry configuration"
git push origin main
```

### 方案 4：清除 Vercel 缓存

有时 Vercel 的缓存可能导致问题：

1. 进入项目 Settings
2. 找到 "Build Cache"
3. 点击 "Clear All"
4. 重新部署

### 方案 5：使用 pnpm 特定配置

在项目根目录创建 `.npmrc` 文件，优化 pnpm 配置：

```bash
cat > .npmrc << 'EOF'
registry=https://registry.npmjs.org/
shamefully-hoist=true
strict-peer-dependencies=false
EOF
```

## 完整的 .npmrc 配置示例

```
# npm 注册表
registry=https://registry.npmjs.org/

# pnpm 配置
shamefully-hoist=true
strict-peer-dependencies=false

# 网络配置
fetch-timeout=60000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
fetch-retries=5

# 其他优化
prefer-offline=true
```

## 验证部署是否成功

### 检查构建日志

1. 进入 Vercel 仪表板
2. 选择部署
3. 查看 "Build Logs"
4. 搜索以下成功标志：

```
✓ Installed dependencies
✓ Build completed successfully
✓ Deployment complete
```

### 访问您的网站

部署成功后，您应该能够访问：

- **预览 URL**：`https://your-project-name.vercel.app`
- **自定义域名**：`https://1ucoin.fun`（如已配置）

## 常见错误及解决方案

### 错误 1：ERR_INVALID_THIS

**原因**：npm 注册表连接问题

**解决**：
- 等待自动重试
- 手动重新部署
- 清除 Vercel 缓存

### 错误 2：ERESOLVE unable to resolve dependency tree

**原因**：依赖版本冲突

**解决**：
```bash
# 在本地运行
pnpm install --force

# 推送到 GitHub
git add pnpm-lock.yaml
git commit -m "Update pnpm lock file"
git push origin main
```

### 错误 3：Build failed: Command "pnpm build" exited with 1

**原因**：构建脚本错误

**解决**：
```bash
# 在本地测试构建
pnpm build

# 查看错误信息并修复
# 然后推送修复
git add .
git commit -m "Fix build errors"
git push origin main
```

## 性能优化建议

### 1. 优化 pnpm 锁定文件

确保 `pnpm-lock.yaml` 已提交到 GitHub：

```bash
git add pnpm-lock.yaml
git commit -m "Add pnpm lock file"
git push origin main
```

### 2. 使用 Vercel 的构建缓存

Vercel 会自动缓存 `node_modules`，加快后续部署。

### 3. 减少依赖包大小

检查是否有不必要的依赖：

```bash
pnpm list
```

### 4. 启用增量静态再生成（ISR）

虽然这是静态网站，但可以配置缓存头以加快加载。

## 监控部署状态

### 启用 Vercel 通知

1. 进入项目 Settings
2. 找到 "Notifications"
3. 配置邮件或 Slack 通知

### 查看部署历史

1. 进入 "Deployments" 标签
2. 查看所有部署及其状态
3. 点击任何部署查看详细日志

## 获取帮助

### Vercel 官方资源

- 文档：https://vercel.com/docs
- 状态页：https://vercel.com/status
- 支持：https://vercel.com/support

### npm 相关

- npm 文档：https://docs.npmjs.com
- npm 状态：https://status.npmjs.org

### 项目相关

- GitHub Issues：检查项目仓库
- 社区论坛：https://vercel.com/support

## 快速检查清单

- [ ] 部署日志中是否显示 "Build completed successfully"？
- [ ] 能否访问 Vercel 提供的预览 URL？
- [ ] 是否配置了自定义域名？
- [ ] 环境变量是否正确设置？
- [ ] 是否启用了 HTTPS？

## 下一步

如果部署仍然失败，请：

1. **收集信息**：
   - 完整的构建日志
   - 错误消息
   - 部署时间

2. **尝试本地构建**：
   ```bash
   pnpm install
   pnpm build
   pnpm preview
   ```

3. **联系支持**：
   - Vercel 支持：https://vercel.com/support
   - GitHub Issues：提交问题报告

---

**记住**：大多数 npm 注册表连接问题都是临时的，通常会通过重试自动解决。
