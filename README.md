# 💫 每天夸你一万遍

一个PWA应用，每天定时给你发送温暖的夸奖和鼓励。

## ✨ 功能特点

- 🎯 **开箱即用** - 内置60条精选夸夸文案，无需API Key
- 🎨 **多种风格** - 温柔治愈、热血鼓励、幽默调侃、文艺清新
- 📱 **PWA支持** - 可添加到手机主屏幕，像原生APP一样使用
- 🔔 **定时推送** - 支持每日定时通知（需授权）
- 💾 **本地存储** - 所有数据存储在本地，保护隐私
- 🌸 **精美动效** - 渐变背景 + 漂浮爱心动画

## 🚀 快速开始

### 方法一：一键部署到 Vercel（推荐）

1. 在 GitHub 上创建新仓库，上传这些文件
2. 登录 [Vercel](https://vercel.com)，点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. 点击 Deploy，1分钟后即可获得在线链接
5. 手机访问链接，添加到主屏幕即可使用

### 方法二：GitHub Pages 部署

1. 在 GitHub 创建新仓库（如 `praise-app`）
2. 上传所有文件到仓库
3. 进入 Settings → Pages → Source 选择 main 分支
4. 等待1-2分钟，获得 `https://你的用户名.github.io/praise-app` 链接

### 方法三：本地测试

```bash
# 进入项目目录
cd praise-app

# 启动本地服务器（需要HTTPS或localhost）
python3 -m http.server 8080
# 或
npx serve -l 8080

# 浏览器访问 http://localhost:8080
```

## 📱 安装到手机

### iPhone (iOS 16.4+)

1. 用 Safari 打开部署后的链接
2. 点击底部分享按钮 ⎋
3. 选择「添加到主屏幕」
4. 桌面会出现「夸夸」图标，点击即可使用
5. 首次打开设置推送时间，授权通知权限

### Android

1. 用 Chrome 打开部署后的链接
2. 点击菜单 ⋮ → 「添加到主屏幕」或「安装应用」
3. 按提示完成安装
4. 打开应用设置推送

## 🛠️ 技术栈

- 纯前端实现：HTML5 + CSS3 + JavaScript
- PWA 技术：Service Worker + Manifest + IndexedDB
- 推送通知：Web Notifications API
- 图标：SVG + Emoji（无需外部资源）

## 📁 文件说明

```
praise-app/
├── index.html      # 主页面（界面结构）
├── app.js          # 核心业务逻辑（60条内置文案）
├── sw.js           # Service Worker（离线缓存+推送）
├── manifest.json   # PWA配置（图标、主题色等）
└── README.md       # 本文件
```

## 🎨 自定义文案

想用自己的夸夸文案？编辑 `app.js` 中的 `PRAISE_LIBRARY`：

```javascript
const PRAISE_LIBRARY = {
  gentle: ["你的文案1", "你的文案2", ...],
  energetic: [...],
  humor: [...],
  poetic: [...]
};
```

## ⚠️ 注意事项

1. **iOS限制**：iPhone必须通过Safari添加到主屏幕后才能接收推送
2. **推送机制**：当前版本使用简单定时，实际推送依赖浏览器后台运行
3. **离线使用**：添加到主屏幕后，断网也能查看已生成的夸夸
4. **数据存储**：所有数据存在本地浏览器中，清除缓存会丢失

## 🔮 后续优化方向

- [ ] 接入云端API生成更个性化的文案
- [ ] 支持早中晚多个时段推送
- [ ] 历史记录查看和收藏功能
- [ ] 用户自定义文案库
- [ ] 暗黑模式支持

## 💝 致谢

愿每一个人都能被这个世界温柔以待。

---

Made with 💖 by 星
