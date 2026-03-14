# Shopline 电商后台管理系统

## 项目简介

Shopline 是一个基于 Vue 3 + Vite 构建的电商后台管理系统，包含数据看板、商品管理、订单管理、用户管理等核心模块。系统采用现代化的前端技术栈，提供直观友好的用户界面和完善的管理功能。

## 技术栈

- **前端框架**：Vue 3.5.24
- **构建工具**：Vite 7.2.2
- **路由管理**：Vue Router 4.6.3
- **数据可视化**：ECharts 6.0.0 + Vue-ECharts 8.0.1
- **开发语言**：JavaScript

## 功能特性

### 📊 数据看板
- 销售数据统计
- 订单趋势分析
- 商品库存监控
- 用户增长分析

### 🛍️ 商品管理
- 商品列表展示
- 商品添加与编辑
- 商品分类管理
- 库存状态监控

### 📋 订单管理
- 订单列表查询
- 订单详情查看
- 订单状态管理
- 订单数据导出

### 👥 用户管理
- 用户列表管理
- 用户信息编辑
- 权限管理
- 登录状态监控

### ℹ️ 关于我们
- 系统介绍
- 开发团队信息
- 联系方式

## 项目结构

```
├── public/              # 静态资源
├── src/
│   ├── api/            # API 接口和模拟数据
│   │   ├── mock.js     # 模拟数据逻辑
│   │   └── mock.json   # 模拟数据文件
│   ├── assets/         # 静态资源文件
│   ├── components/     # 公共组件
│   │   ├── LayoutContainer.vue   # 布局容器
│   │   ├── MainContent.vue       # 主内容区域
│   │   ├── SidebarComponent.vue  # 侧边栏组件
│   │   ├── ProductForm.vue       # 商品表单
│   │   ├── OrderDetail.vue       # 订单详情
│   │   └── 各种图表组件          # 数据可视化组件
│   ├── config/         # 配置文件
│   ├── js/             # 第三方库
│   ├── router/         # 路由配置
│   ├── views/          # 页面组件
│   │   ├── Home.vue    # 首页/数据看板
│   │   ├── Products.vue # 商品管理
│   │   ├── Orders.vue  # 订单管理
│   │   ├── Users.vue   # 用户管理
│   │   └── About.vue   # 关于我们
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── .gitignore          # Git 忽略配置
├── index.html          # HTML 模板
├── package.json        # 项目配置
├── vite.config.js      # Vite 配置
└── README.md           # 项目说明
```

## 安装与运行

### 环境要求
- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

系统将在 `http://localhost:5173` 启动开发服务器

### 构建生产版本

```bash
npm run build
```

构建结果将输出到 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 主要功能模块

### 数据看板
- 集成多种图表展示销售数据
- 实时监控系统运行状态
- 提供关键业务指标分析

### 商品管理
- 支持商品的增删改查操作
- 提供商品分类和标签管理
- 实时库存状态监控

### 订单管理
- 订单列表分页展示
- 订单状态实时更新
- 支持订单详情查看和处理

### 用户管理
- 用户信息管理
- 权限控制
- 登录日志记录

## 开发指南

### 路由配置
路由配置文件位于 `src/router/index.js`，可根据需要添加或修改路由。

### 模拟数据
项目使用 `src/api/mock.js` 和 `src/api/mock.json` 提供模拟数据，方便开发和测试。

### 组件开发
- 公共组件放在 `src/components/` 目录
- 页面组件放在 `src/views/` 目录
- 组件命名采用 PascalCase 格式

## 部署说明

1. 构建生产版本：`npm run build`
2. 将 `dist` 目录下的文件部署到 Web 服务器
3. 确保服务器配置正确的 MIME 类型和路由重写规则

## 浏览器兼容性

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎联系我们。

---

**Shopline 电商后台管理系统** - 为您的电商业务提供高效、便捷的管理解决方案！
