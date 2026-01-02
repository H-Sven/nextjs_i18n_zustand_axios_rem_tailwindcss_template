# Next.js Enterprise Template

这是一个基于 Next.js (App Router) 的现代化企业级前端项目模板，集成了国际化、状态管理、网络请求封装、UI 组件库以及严格的代码规范配置。旨在提供一个开箱即用、高效、可维护的开发基础。

## 🚀 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **核心库**: [React 19](https://react.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/) (图标: [Lucide React](https://lucide.dev/icons/))
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand) (支持持久化)
- **国际化**: [next-intl](https://next-intl-docs.vercel.app/)
- **网络请求**: [Axios](https://axios-http.com/)
- **工具库**:
  - [Day.js](https://day.js.org/) (日期处理)
  - [Mitt](https://github.com/developit/mitt) (事件总线)
- **代码规范**: ESLint, Prettier, Husky, Lint-staged

## ✨ 功能特性

### 1. 核心架构

- **App Router**: 采用 Next.js 最新的 App Router 模式。
- **国际化 (i18n)**:
  - 深度集成 `next-intl`。
  - 支持路由前缀策略 (如 `/zh/`, `/en/`)。
  - 默认开启 `as-needed` 模式（默认语言不带前缀）。
  - 中间件 (`middleware.ts`) 自动处理语言重定向。
- **状态管理**:
  - 使用 `Zustand` 进行轻量级状态管理。
  - 集成 `persist` 中间件，支持状态自动持久化到 `localStorage`。
  - 示例：`src/store/appStore.ts` (语言设置), `src/store/userStore.ts` (用户信息)。

### 2. 网络请求深度封装

- **位置**: `src/lib/request.ts`
- **功能**:
  - 全局拦截器（请求/响应）。
  - **自动取消重复请求**: 使用 `AbortController` 自动取消短时间内相同的挂起请求。
  - 统一错误处理。
  - 类型友好的 API 设计。

### 3. UI 与 样式

- **Tailwind CSS v4**: 最新版配置，支持 CSS 变量。
- **Shadcn UI**: 已集成基础组件（Button, Input 等）。
- **移动端适配**: 自动转换 `px` 为 `rem`

### 4. 实用工具

- **WebSocket Hook**:
  - `src/hooks/useWebSocket.ts`
  - 支持自动重连、心跳检测、手动断开/重连。
  - 示例页面：`/websocket`。
- **Day.js 封装**:
  - `src/lib/dayjs.ts`
  - 预置常用插件 (`relativeTime`, `isSameOrBefore` 等)。
  - 统一的时间格式化函数。
- **EventBus**: 基于 `mitt` 的轻量级事件总线 (`src/lib/eventBus.ts`)。

### 5. 工程化配置

- **多环境支持**: 支持 `development`, `test`, `pre`, `production` 等环境配置。
- **代码规范**:
  - `ESLint` + `Prettier` 自动格式化。
  - `Husky` + `lint-staged`: 提交前自动检查代码并修复格式。
  - 导入排序: 集成 `eslint-plugin-simple-import-sort`。

## 📂 目录结构

```
.
├── messages/              # 国际化翻译文件 (zh.json, en.json)
├── public/                # 静态资源 (svg, images)
├── src/
│   ├── api/               # API 接口定义
│   │   └── user.ts        # 用户相关 API
│   ├── app/               # 页面路由 (App Router)
│   │   ├── [locale]/      # 国际化动态路由
│   │   │   ├── login/     # 登录页面
│   │   │   ├── websocket/ # WebSocket 示例页面
│   │   │   ├── layout.tsx # 根布局 (包含 i18n Provider)
│   │   │   └── page.tsx   # 首页
│   │   ├── favicon.ico    # 网站图标
│   │   └── globals.css    # 全局样式 (Tailwind 引入)
│   ├── components/        # 公共组件
│   │   ├── ui/            # UI 基础组件 (Button, Input 等)
│   ├── hooks/             # 自定义 Hooks
│   │   └── useWebSocket.ts # WebSocket 封装 Hook
│   ├── i18n/              # 国际化配置
│   │   ├── request.ts     # next-intl 请求配置
│   │   └── routing.ts     # 路由配置
│   ├── lib/               # 工具函数库
│   │   ├── dayjs.ts       # Day.js 配置
│   │   ├── eventBus.ts    # 事件总线
│   │   ├── request.ts     # Axios 请求封装
│   │   └── utils.ts       # 通用工具函数 (cn 等)
│   ├── store/             # Zustand 状态管理
│   │   ├── appStore.ts    # 应用级状态 (如语言设置)
│   │   └── userStore.ts   # 用户状态
│   ├── types/             # TypeScript 类型定义
│   └── middleware.ts      # 中间件 (处理国际化路由重定向)
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── .env.test              # 测试环境变量
├── .husky/                # Git Hooks 配置
├── eslint.config.mjs      # ESLint 配置
├── next.config.ts         # Next.js 配置
├── package.json           # 项目依赖与脚本
└── postcss.config.mjs     # PostCSS 配置
```

## 🛠️ 快速开始

### 1. 环境准备

- Node.js >= 18
- pnpm (推荐)

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)。

## 🌍 环境变量

项目使用 `.env.*` 文件管理多环境配置。

### 变量说明

| 变量名                | 说明              | 示例                                |
| :-------------------- | :---------------- | :---------------------------------- |
| `NEXT_PUBLIC_ENV`     | 当前环境标识      | `development`, `production`, `test` |
| `NEXT_PUBLIC_API_URL` | 后端 API 接口地址 | `http://localhost:3000/api`         |

### 环境文件

- `.env.development`: 开发环境 (`pnpm dev`)
- `.env.test`: 测试环境 (`pnpm build:test`)
- `.env.pre`: 预发布环境 (`pnpm build:pre`)
- `.env.production`: 生产环境 (`pnpm build:prod` 或 `pnpm build`)

构建特定环境版本：

```bash
# 构建测试环境
pnpm build:test

# 构建生产环境
pnpm build
```

## 🚢 部署指南

本项目已开启 `output: 'standalone'` 模式，并配置了自动化构建脚本。构建后会自动生成完整的独立部署包，无需安装 `node_modules` 即可运行。

### 1. 构建项目

执行构建命令会自动完成打包和静态资源整合：

```bash
pnpm build
```

构建完成后，`.next/standalone` 目录即为完整的部署包（已自动包含 `public` 和 `.next/static` 资源）。

### 2. 本地预览

构建完成后，你可以在本地项目根目录下直接验证构建结果：

```bash
pnpm start:standalone
# 或者
node .next/standalone/server.js
```

### 3. 服务器部署

1.  **上传文件**：将 `.next/standalone/` 目录下的**所有内容**上传到服务器的目标目录。
2.  **启动服务**：进入服务器上的目标目录，直接运行：

    ```bash
    node server.js
    ```

> **提示**:
>
> - `standalone` 模式生成的 `package.json` 不包含原项目的 scripts，所以服务器上通常直接用 `node server.js` 启动。
> - 依然可以通过环境变量控制端口：`PORT=8080 HOSTNAME=0.0.0.0 node server.js`
