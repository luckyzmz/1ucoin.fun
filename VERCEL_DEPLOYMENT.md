# 1ucoin.fun 在 Vercel 上的部署指南

本文档说明如何将 1ucoin.fun 网站部署到 Vercel。

## 前置要求

- Node.js 18+ 和 pnpm
- Vercel 账户（免费注册：https://vercel.com）
- GitHub 账户（用于连接代码仓库）

## 部署步骤

### 方法 1：通过 Git 连接（推荐）

这是最简单的方法，Vercel 会自动监听代码变更并重新部署。

#### 步骤 1：上传到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init
git add .
git commit -m "Initial commit: 1ucoin.fun homepage"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/1ucoin-homepage.git
git branch -M main
git push -u origin main
```

#### 步骤 2：在 Vercel 中导入项目

1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 输入您的 GitHub 仓库 URL：`https://github.com/YOUR_USERNAME/1ucoin-homepage`
4. Vercel 会自动检测项目配置

#### 步骤 3：配置构建设置

Vercel 会自动识别以下配置（来自 vercel.json）：

- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

点击 "Deploy" 即可开始部署。

### 方法 2：使用 Vercel CLI

如果您想在本地测试后再部署：

```bash
# 1. 全局安装 Vercel CLI
npm i -g vercel

# 2. 在项目目录中登录 Vercel
vercel login

# 3. 部署项目
vercel

# 4. 按照提示选择项目设置
# - 选择 "Link to existing project" 或 "Create new project"
# - 确认构建设置
# - 部署完成后会获得一个 URL

# 5. 部署到生产环境
vercel --prod
```

## 环境变量配置

如果您的项目需要环境变量，在 Vercel 中配置：

1. 进入项目设置 → Settings
2. 找到 "Environment Variables" 部分
3. 添加需要的变量（例如 API 密钥等）

对于这个项目，默认不需要额外的环境变量。

## 自定义域名

### 添加自己的域名

1. 在 Vercel 项目设置中找到 "Domains"
2. 点击 "Add" 并输入您的域名
3. 按照 Vercel 的指示更新 DNS 记录
4. 等待 DNS 生效（通常 5-48 小时）

### 域名 DNS 配置示例

如果您的域名是 `1ucoin.fun`，需要在域名注册商处添加以下 CNAME 记录：

```
Name: www
Type: CNAME
Value: cname.vercel.com
```

或者使用 A 记录：

```
Name: @
Type: A
Value: 76.76.19.132
```

## 部署后的优化

### 1. 启用自动 HTTPS

Vercel 默认为所有部署提供免费的 HTTPS 证书。

### 2. 配置缓存策略

vercel.json 中已配置了缓存头：

- 静态资源（/assets/）：31536000 秒（1 年）
- API 响应：60 秒

### 3. 启用 Serverless 函数

如果需要后端 API，可以在 `api/` 目录中创建 Serverless 函数。

## 监控和日志

### 查看部署日志

1. 进入 Vercel 项目仪表板
2. 选择 "Deployments" 标签
3. 点击任何部署查看详细日志

### 性能监控

1. 在 Vercel 项目中启用 "Analytics"
2. 查看页面加载时间、用户数据等

## 常见问题

### Q: 部署失败，显示 "pnpm not found"

**A**: 确保 package.json 中有 `"packageManager": "pnpm@10.4.1+sha512..."` 字段。Vercel 会自动使用指定的包管理器版本。

### Q: 构建成功但页面显示 404

**A**: 这通常是因为 SPA 路由问题。vercel.json 中的 `rewrites` 已配置为将所有请求重定向到 index.html。

### Q: 如何在本地测试生产构建

**A**: 运行以下命令：

```bash
pnpm build
pnpm preview
```

然后访问 http://localhost:4173

### Q: 如何回滚到之前的版本

**A**: 在 Vercel 仪表板的 "Deployments" 中，找到想要的版本，点击三点菜单，选择 "Promote to Production"。

## 部署后的下一步

1. **测试网站**：访问您的 Vercel URL 确保一切正常
2. **配置自定义域名**：将 1ucoin.fun 指向 Vercel
3. **启用分析**：在 Vercel 中启用 Web Analytics
4. **设置 CI/CD**：配置自动测试和部署流程
5. **监控性能**：使用 Vercel Analytics 和 Web Vitals

## 获取帮助

- Vercel 文档：https://vercel.com/docs
- 项目问题：检查 GitHub Issues
- 社区支持：https://vercel.com/support

---

**部署完成后，您的网站将获得：**

✅ 全球 CDN 加速
✅ 自动 HTTPS
✅ 自动扩展
✅ 免费 SSL 证书
✅ 性能分析
✅ 自动部署（Git 推送时）
