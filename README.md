# Next.js Enterprise Template

这是一个基于 Next.js (App Router) 的现代化企业级前端项目模板，集成了国际化、状态管理、网络请求封装、UI 组件库以及严格的代码规范配置。旨在提供一个开箱即用、高效、可维护的开发基础。

## 🚀 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) (App Router)
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
- **移动端适配**: 内置 REM 适配方案 (`src/components/RemScript.tsx`)，默认设计稿宽 375px (1rem = 100px)。

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
├── public/                # 静态资源
├── src/
│   ├── api/               # API 接口定义
│   ├── app/               # 页面路由 (App Router)
│   │   ├── [locale]/      # 国际化路由入口
│   │   │   ├── login/     # 登录页
│   │   │   ├── websocket/ # WebSocket 示例页
│   │   │   └── page.tsx   # 首页
│   │   └── globals.css    # 全局样式
│   ├── components/        # 组件
│   │   ├── ui/            # Shadcn UI 组件
│   │   └── RemScript.tsx  # Rem 适配脚本
│   ├── hooks/             # 自定义 Hooks (useWebSocket 等)
│   ├── i18n/              # 国际化配置
│   ├── lib/               # 工具函数 (request, dayjs, eventBus, utils)
│   ├── store/             # Zustand 状态管理
│   ├── types/             # TypeScript 类型定义
│   └── middleware.ts      # Next.js 中间件
├── .husky/                # Git Hooks
├── eslint.config.mjs      # ESLint 配置
├── next.config.ts         # Next.js 配置
└── package.json
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

### 4. 构建生产版本

```bash
pnpm build
```

### 5. 启动生产服务

```bash
pnpm start
```

### 6. 代码检查与修复

```bash
# 运行 ESLint
pnpm lint

# 自动修复
pnpm lint:fix
```

## 📖 使用指南

### 切换语言

项目使用 `next-intl`。在页面中：

```tsx
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export default function Page() {
  const t = useTranslations('HomePage')
  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/about" locale="en">
        Switch to English
      </Link>
    </div>
  )
}
```

### 使用 Store (Zustand)

```tsx
import { useAppStore } from '@/store/appStore'

// 组件内
const { locale, setLocale } = useAppStore()
```

### 发起网络请求

```tsx
import request from '@/lib/request'

// GET
const data = await request.get('/api/users')

// POST
await request.post('/api/login', { username, password })
```

### 使用 WebSocket

```tsx
import { useWebSocket } from '@/hooks/useWebSocket'

const { sendMessage, isConnected, disconnect, reconnect } = useWebSocket({
  url: 'wss://echo.websocket.org',
  heartbeatInterval: 5000,
})
```

## 📄 License

MIT
