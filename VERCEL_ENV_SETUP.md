# Vercel 环境变量配置指南

## 问题说明

当您在 Vercel 中导入 GitHub 仓库时，可能会看到以下错误：

```
环境变量 "VITE_APP_TITLE" 引用了不存在的密钥 "1ucoin.fun"
```

这是因为之前的 `vercel.json` 配置中使用了密钥引用语法（`@密钥名`），但这些密钥在 Vercel 中还未定义。

## 解决方案

### 方案 1：使用更新的 vercel.json（推荐）

最新的 `vercel.json` 已经移除了环境变量引用，改为直接在 Vite 配置中处理。这样可以避免 Vercel 的密钥引用问题。

**操作步骤**：

1. 确保您使用的是最新的 `vercel.json`（已移除 `env` 和 `build.env` 部分）
2. 重新推送到 GitHub
3. 在 Vercel 中重新导入或触发重新部署

### 方案 2：在 Vercel 仪表板中手动配置环境变量

如果您想在 Vercel 中明确设置环境变量，可以按以下步骤操作：

#### 步骤 1：进入项目设置

1. 登录 https://vercel.com/dashboard
2. 选择您的 1ucoin 项目
3. 点击 "Settings" 标签

#### 步骤 2：添加环境变量

1. 在左侧菜单中找到 "Environment Variables"
2. 点击 "Add New"
3. 添加以下变量：

| 变量名 | 值 | 说明 |
|-------|-----|------|
| `VITE_APP_TITLE` | `1ucoin.fun` | 应用标题 |
| `VITE_APP_LOGO` | `1ucoin.fun` | 应用 Logo |

#### 步骤 3：重新部署

添加环境变量后，需要重新部署以应用这些变量：

1. 进入 "Deployments" 标签
2. 找到最新的部署
3. 点击三点菜单 → "Redeploy"

### 方案 3：使用 Vercel CLI 设置环境变量

如果您更喜欢命令行操作：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 进入项目目录
cd your-project-directory

# 链接到 Vercel 项目
vercel link

# 拉取环境变量
vercel env pull

# 编辑 .env.local 文件（如需要）
# 然后推送到 Vercel
vercel env push
```

## 环境变量说明

### 必需变量

这些变量对于基本功能是必需的：

- **VITE_APP_TITLE**: 应用的显示标题（默认：1ucoin.fun）
- **VITE_APP_LOGO**: 应用的 Logo 标识（默认：1ucoin.fun）

### 可选变量

这些变量用于高级功能：

- **VITE_ANALYTICS_ENDPOINT**: 分析服务端点
- **VITE_ANALYTICS_WEBSITE_ID**: 网站分析 ID
- **VITE_APP_ID**: 应用 ID
- **VITE_OAUTH_PORTAL_URL**: OAuth 门户 URL
- **VITE_FRONTEND_FORGE_API_URL**: 前端 API 端点
- **VITE_FRONTEND_FORGE_API_KEY**: 前端 API 密钥

## 验证部署

部署完成后，验证环境变量是否正确应用：

1. 访问您的 Vercel URL
2. 打开浏览器开发者工具（F12）
3. 检查 Network 标签中的请求头
4. 或在 Console 中检查应用配置

## 常见问题

### Q: 我已经更新了 vercel.json，但仍然看到错误

**A**: 清除 Vercel 缓存并重新部署：
1. 进入 Vercel 仪表板
2. 选择项目 → Settings → Git
3. 点击 "Disconnect Git"
4. 重新连接 GitHub 仓库

### Q: 环境变量在本地工作，但在 Vercel 上不工作

**A**: 确保：
1. 变量名称完全匹配（区分大小写）
2. 变量值没有多余的空格
3. 已触发重新部署

### Q: 如何在不同的环境（预览/生产）中使用不同的环境变量

**A**: 在 Vercel 中，可以为不同环境设置不同的变量：
1. 在 Environment Variables 页面
2. 每个变量可以选择应用于：
   - Production（生产）
   - Preview（预览）
   - Development（开发）

## 推荐做法

1. **使用 .env.local 进行本地开发**：
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 添加您的值
   ```

2. **在 Vercel 中设置敏感信息**：
   - API 密钥
   - 访问令牌
   - 其他敏感数据

3. **定期检查部署日志**：
   - 查看构建是否成功
   - 检查是否有警告或错误

## 获取帮助

- Vercel 环境变量文档：https://vercel.com/docs/projects/environment-variables
- 项目 GitHub Issues：检查是否有相关问题
- Vercel 支持：https://vercel.com/support

---

**快速解决步骤总结**：

1. ✅ 使用最新的 `vercel.json`（已修复）
2. ✅ 推送到 GitHub
3. ✅ 在 Vercel 中重新导入或触发重新部署
4. ✅ 如需要，在 Vercel 仪表板中手动添加环境变量
5. ✅ 验证部署成功
