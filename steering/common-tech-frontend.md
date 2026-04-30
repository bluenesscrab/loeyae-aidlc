# 前端编码规范

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue + TypeScript | 3.5.12 / 5.3.3 |
| 构建 | Vite | 5.4.4 |
| 组件库 | Element Plus | 2.11.8 |
| 图标 | Element Plus Icons | 2.3.2 |
| 表单生成器 | @form-create/element-ui | 3.1.11 |
| 状态 | Pinia | 2.1.7 |
| 路由 | Vue Router | 4.4.5 |
| 国际化 | Vue I18n | 9.10.2 |
| 样式 | Sass | 1.58.0 |
| 样式 | Windi CSS | 3.5.6 |
| 样式 | stylelint | 14.16.1 |
| 动画 | animate.css | 4.1.1 |
| 图表 | ECharts | 5.4.1 |
| 图表 | echarts-wordcloud | 2.1.0 |
| 颜色选择器 | vue-color | 3.3.3 |
| 富文本编辑器 | @wangeditor/editor | 5.1.23 |
| 富文本编辑器 | @wangeditor/editor-for-vue | 5.1.10 |
| 图片裁剪 | cropperjs | 1.5.13 |
| 日期处理 | dayjs | 1.11.7 |
| 加密 | crypto-js | 4.1.1 |
| 前端二维码 | qrcode | 1.5.1 |
| Vue 工具 | @vueuse/core | 9.12.0 |
| 进度条 | nprogress | 0.2.0 |
| 工具 | lodash-es | 4.17.21 |
| 工具 | autoprefixer | 10.4.13 |
| 中国省市区字典 | province-city-china | 8.5.8 |
| HTTP | Axios | 1.4.0 |
| 图标 | Iconify | - |

---

## 目录结构

```
src/
├── api/           # API 接口定义
│   └── system/
│       └── user/  # 按模块组织
├── App.vue        # 应用入口
├── assets/        # 静态资源
├── components/    # 全局组件（优先使用）
├── config/        # 全局配置
├── directives/    # 全局指令
├── hooks/         # Composables
├── layouts/       # 布局组件
├── locales/       # 国际化文件
├── main.ts        # 应用入口
├── permission/    # 权限管理
├── router/        # 路由配置
├── store/         # Pinia Store
├── styles/        # 全局样式
├── types/         # 类型定义
├── utils/         # 工具函数
└── views/         # 页面组件
```

---

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `userName`, `getUserInfo` |
| 组件文件 | PascalCase | `UserForm.vue` → name: `UserForm` |
| 常量 | UPPER_SNAKE_CASE | `MAX_COUNT` |
| 类型/接口 | PascalCase | `UserVO`, `FormRules` |
| CSS类 | kebab-case | `user-form-container` |
| 文件夹 | kebab-case | `user-management` |

---

## 代码风格

- **缩进**: 2 空格
- **引号**: 单引号
- **分号**: 无
- **属性换行**: 标签属性超过 2 个时换行
- **自闭合**: `<Icon icon="ep:plus" />`

### 导入顺序

```typescript
// 1. Vue 相关
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 2. 第三方库
import { ElMessage, ElMessageBox } from 'element-plus'

// 3. 项目内部（@别名）
import request from '@/config/axios'
import { useUserStore } from '@/store/modules/user'
import type { UserVO } from '@/api/system/user'

// 4. 相对路径
import UserForm from './UserForm.vue'
```

---

## TypeScript

- 路径别名: `@/*` → `src/*`
- 类型导入使用 `type` 关键字: `import type { UserVO }`
- 避免使用 `any`，使用 `unknown` 或具体类型

### 类型定义

```typescript
// api/system/user/index.ts
export interface UserVO {
  id: number
  name: string
  account: string
  mobile: string
  status: number
}

export interface UserCreate {
  name: string
  account: string
  mobile: string
}

export interface UserPageQuery {
  pageNo: number
  pageSize: number
  name?: string
  status?: number
}
```

---

## Vue 组件规范

### Script Setup

```typescript
defineOptions({ name: 'UserList' })

const { t } = useI18n()
const message = useMessage()
const router = useRouter()

// 响应式状态
const loading = ref(false)
const list = ref<UserVO[]>([])
const total = ref(0)
const queryParams = reactive<UserPageQuery>({
  p: 1,
  s: 10
})

// 计算属性
const isEmpty = computed(() => list.value.length === 0)

// 方法
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getPage(queryParams)
    list.value = data.rows
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  getList()
})
```

### 模板

```vue
<!-- 属性换行 -->
<el-button
  type="primary"
  :loading="loading"
  @click="handleSubmit"
>
  提交
</el-button>

<!-- 自闭合 -->
<Icon icon="ep:plus" />
<el-input v-model="name" />

<!-- v-for 必须有 key -->
<el-table :data="list">
  <el-table-column prop="name" label="姓名" />
</el-table>
```

---

## API 调用

### API 定义

```typescript
// api/system/user/index.ts
import request from '@/config/axios'
import type { UserVO, UserCreate, UserPageQuery } from './types'

export const UserApi = {
  getPage: (params: UserPageQuery) => 
    request.get({ url: '/system/user/page', params }),
  
  get: (id: number) => 
    request.get({ url: `/system/user/${id}` }),
  
  create: (data: UserCreate) => 
    request.post({ url: '/system/user/', data }),
  
  update: (data: UserCreate) => 
    request.put({ url: '/system/user/', data }),
  
  delete: (id: number) => 
    request.delete({ url: `/system/user/${id}` })
}
```

### 错误处理

```typescript
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getPage(queryParams)
    list.value = data.rows
  } catch (error) {
    message.error('获取列表失败')
  } finally {
    loading.value = false
  }
}
```

---

## 状态管理 (Pinia)

### Store 定义

```typescript
// store/modules/user.ts
import { defineStore } from 'pinia'
import type { UserVO } from '@/api/system/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserVO | null,
    token: ''
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.userInfo?.name ?? ''
  },
  
  actions: {
    setUserInfo(info: UserVO) {
      this.userInfo = info
    },
    
    async login(credentials: LoginParams) {
      const data = await AuthApi.login(credentials)
      this.token = data.token
      this.userInfo = data.user
    },
    
    logout() {
      this.token = ''
      this.userInfo = null
    }
  },
  
  persist: true // 持久化
})
```

### 使用 Store

```typescript
const userStore = useUserStore()

// 读取状态
const userName = userStore.userName
const isLoggedIn = userStore.isLoggedIn

// 调用 action
await userStore.login({ account, password })
userStore.logout()
```

---

## 路由规范

### 路由定义

```typescript
// router/modules/system.ts
const systemRoutes: AppRouteRecordRaw[] = [
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: { title: '系统管理', icon: 'ep:setting' },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user/index.vue'),
        name: 'User',
        meta: { title: '用户管理' }
      }
    ]
  }
]
```

### 路由跳转

```typescript
// 编程式导航
router.push({ name: 'User', params: { id: 1 } })
router.push('/system/user')

// 声明式导航
<router-link to="/system/user">用户管理</router-link>
```

---

## 国际化

### 定义翻译

```typescript
// locales/zh-CN.ts
export default {
  system: {
    user: {
      title: '用户管理',
      name: '用户名',
      account: '账号',
      mobile: '手机号'
    }
  }
}
```

### 使用翻译

```vue
<template>
  <h1>{{ t('system.user.title') }}</h1>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
```

---

## 优先使用现有组件

| 组件 | 用途 | 路径 |
|------|------|------|
| `ContentWrap` | 内容包装器 | `@/components/ContentWrap` |
| `Dialog` | 对话框 | `@/components/Dialog` |
| `Form` | 高级表单 | `@/components/Form` |
| `Table` | 高级表格 | `@/components/Table` |
| `UploadFile` | 文件上传 | `@/components/UploadFile` |
| `UploadImg` | 图片上传 | `@/components/UploadImg` |
| `Icon` | 图标 | `@/components/Icon` |
| `Pagination` | 分页 | `@/components/Pagination` |

❌ 避免直接使用 `el-dialog`、`el-form` 等原生组件

---

## 常用 Hooks

```typescript
// 消息提示
import { useMessage } from '@/hooks/web/useMessage'
const message = useMessage()
message.success('操作成功')

// 国际化
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

// 表格
import { useTable } from '@/hooks/web/useTable'
const { register, tableObject, methods } = useTable({
  getListApi: UserApi.getPage
})

// 表单
import { useForm } from '@/hooks/web/useForm'
const { register, formRef, methods } = useForm()
```

---

## 构建命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发启动 |
| `pnpm build:dev` | 开发构建 |
| `pnpm build:prod` | 生产构建 |
| `pnpm lint:all` | 代码检查 |
| `pnpm preview` | 预览构建结果 |

---

## 检查清单

- [ ] 优先使用项目组件
- [ ] 遵循命名规范
- [ ] 使用 TypeScript 类型
- [ ] 正确处理错误
- [ ] 国际化文本使用 `t()`
- [ ] 运行 `pnpm lint:all` 通过
