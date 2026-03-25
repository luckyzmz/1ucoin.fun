# Netlify 部署指南 - 1ucoin.fun

由于 Vercel 美国东部环境的网络问题，我们推荐使用 Netlify 进行部署。Netlify 在处理网络不稳定情况下表现更好。

## 为什么选择 Netlify？

| 特性 | Netlify | Vercel |
|-----|---------|--------|
| 网络稳定性 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 依赖缓存 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 构建速度 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 免费额度 | 充足 | 充足 |
| 自定义域名 | ✅ | ✅ |
| HTTPS | ✅ 自动 | ✅ 自动 |

## 快速部署（5 分钟）

### 步骤 1：准备 GitHub

确保您的代码已推送到 GitHub：

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 步骤 2：连接 Netlify

1. 访问 https://netlify.com
2. 点击 "Sign up" 或 "Log in"
3. 选择 "GitHub" 登录
4. 授权 Netlify 访问您的 GitHub 账户

### 步骤 3：导入项目

1. 点击 "Add new site" → "Import an existing project"
2. 选择 "GitHub"
3. 搜索并选择 `1ucoin-homepage` 仓库
4. 点击 "Import"

### 步骤 4：配置构建设置

Netlify 会自动检测到 `netlify.toml`，但您也可以手动配置：

- **Build command**: `pnpm build`
- **Publish directory**: `dist/public`
- **Node version**: 18

点击 "Deploy site"

### 步骤 5：等待部署完成

- 预期时间：2-5 分钟
- 您会看到构建日志
- 完成后会获得一个临时 URL（如 `https://xxx.netlify.app`）

## 配置自定义域名

### 方式 1：使用 Netlify 的免费域名

1. 在 Netlify 仪表板中找到 "Domain settings"
2. 点击 "Edit site name"
3. 输入您想要的子域名（如 `1ucoin`）
4. 您会得到 `1ucoin.netlify.app`

### 方式 2：使用自己的域名（1ucoin.fun）

#### 步骤 A：在 Netlify 中添加域名

1. 进入 "Domain settings"
2. 点击 "Add domain"
3. 输入 `1ucoin.fun`
4. 选择 "Verify" 或 "Use Netlify nameservers"

#### 步骤 B：更新 DNS 记录

**选项 1：使用 Netlify 的 nameservers（推荐）**

1. 在您的域名注册商（如 GoDaddy、Namecheap 等）中
2. 找到 DNS 设置
3. 将 nameservers 改为 Netlify 提供的：
   - `dns1.p01.nsone.net`
   - `dns2.p01.nsone.net`
   - `dns3.p01.nsone.net`
   - `dns4.p01.nsone.net`
4. 保存并等待 DNS 生效（通常 24-48 小时）

**选项 2：使用 CNAME 记录**

1. 在您的域名注册商中
2. 添加 CNAME 记录：
   - **Name**: `www`
   - **Value**: `your-site.netlify.app`
3. 添加 A 记录指向根域名（如需要）

## 验证部署

### 检查构建日志

1. 进入 Netlify 仪表板
2. 选择您的网站
3. 点击 "Deploys"
4. 查看最新部署的日志

### 访问您的网站

- 临时 URL：`https://xxx.netlify.app`
- 自定义域名：`https://1ucoin.fun`（配置后）

## 自动部署

Netlify 会自动监听 GitHub 的变更：

```bash
# 当您推送代码时
git add .
git commit -m "Update website"
git push origin main

# Netlify 会自动：
# 1. 检测到新的推送
# 2. 克隆最新代码
# 3. 运行 pnpm build
# 4. 部署到生产环境
```

## 环境变量配置

如果您的项目需要环境变量：

1. 进入 Netlify 仪表板
2. 选择网站 → "Site settings"
3. 找到 "Build & deploy" → "Environment"
4. 点击 "Edit variables"
5. 添加需要的变量

## 性能优化

### 启用 Netlify Analytics

1. 进入 "Site settings"
2. 找到 "Analytics"
3. 启用 "Netlify Analytics"
4. 查看网站流量和性能数据

### 启用 Netlify Functions（可选）

如果您需要后端功能，可以使用 Netlify Functions：

```bash
mkdir -p netlify/functions
```

## 常见问题

### Q: 部署失败，显示 npm 错误

**A**: 这通常是因为 Netlify 的 Node 版本不匹配。

解决方案：
1. 在 `netlify.toml` 中明确指定 Node 版本
2. 或在 Netlify 仪表板中设置环境变量 `NODE_VERSION=18`

### Q: 自定义域名不工作

**A**: DNS 生效需要时间。

解决方案：
1. 等待 24-48 小时
2. 使用 `nslookup` 检查 DNS：`nslookup 1ucoin.fun`
3. 在 Netlify 中检查域名状态

### Q: 网站显示 404

**A**: 这是因为 SPA 路由问题。

解决方案：
- `netlify.toml` 中已配置了重定向规则
- 确保文件已提交到 GitHub
- 重新部署

### Q: 如何回滚到之前的版本

**A**: 在 Netlify 仪表板中：
1. 进入 "Deploys"
2. 找到想要的版本
3. 点击三点菜单 → "Publish deploy"

## 获取帮助

- Netlify 文档：https://docs.netlify.com
- Netlify 支持：https://netlify.com/support
- 社区论坛：https://community.netlify.com

## 总结

**预期结果**：
- ✅ 部署成功（2-5 分钟）
- ✅ 网站立即上线
- ✅ 自动 HTTPS
- ✅ 自动部署（Git 推送时）
- ✅ 自定义域名支持

**下一步**：
1. 访问 https://netlify.com
2. 导入您的 GitHub 仓库
3. 配置自定义域名
4. 完成！

---

**Netlify 是最可靠的选择。预期部署会立即成功！**
