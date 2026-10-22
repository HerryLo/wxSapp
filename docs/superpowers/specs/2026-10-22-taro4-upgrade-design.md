# Taro 2 → Taro 4.3 升级设计

日期：2026-10-22
分支：`feat/taro4`

## 背景与目标

项目当前使用 Taro 2.2.17 + React 16.3 + Nerv 构建微信小程序，包含垃圾分类查询、小测验、天气预报三个功能。Taro 2 已停止维护，本次升级到最新稳定版 **Taro 4.3.0 + React 18.3.1**。

目标：

- 微信小程序构建、运行、上传流程可用
- 功能、UI、接口地址与现有版本保持一致
- 页面代码改为函数组件 + Hooks
- 修复会导致崩溃/白屏的运行期问题

本机 Node v22.13.1，满足 Taro 4 要求的 Node >= 18。

## 范围决策

| 决策项 | 选择 |
| --- | --- |
| 平台 | 仅微信小程序（weapp），移除 alipay/swan/tt/h5/rn 构建 |
| 代码风格 | 四个页面重写为函数组件 + Hooks |
| Redux | 完全移除（当前没有页面使用） |
| 修复范围 | 仅修复崩溃/白屏问题，不做其他行为变更 |
| 包管理器 | npm，删除 `yarn.lock` |
| Git | 基于最新 master 新建 `feat/taro4` |

## 工程基线

用 `@tarojs/cli@4.3.0` 官方模板（React + TypeScript + Sass + Webpack5）生成临时基线工程，以它为准更新依赖与配置。

主要依赖：

- `@tarojs/cli`、`@tarojs/taro`、`@tarojs/components`、`@tarojs/react`、`@tarojs/runtime`、`@tarojs/shared`、`@tarojs/helper` 均为 `4.3.0`
- `@tarojs/plugin-framework-react`、`@tarojs/plugin-platform-weapp`、`@tarojs/webpack5-runner` 为 `4.3.0`
- `react`、`react-dom` 为 `18.3.1`
- `typescript`、`sass`、`babel-preset-taro`、`@types/react` 按模板版本
- `miniprogram-ci` 升级到当前稳定版，继续用于上传

移除的依赖：

- Taro 2 全家桶：`@tarojs/async-await`、`@tarojs/mini-runner`、`@tarojs/redux`、`@tarojs/redux-h5`、`@tarojs/router`、`@tarojs/taro-*`（各平台）、`@tarojs/components-rn`、`@tarojs/taro-rn`、`@tarojs/taro-redux-rn`、`@tarojs/taro-router-rn`、`@tarojs/webpack-runner`、`@tarojs/plugin-babel`、`@tarojs/plugin-csso`、`@tarojs/plugin-sass`、`@tarojs/plugin-uglify*`
- `nervjs`、`nerv-devtools`、`redux`、`redux-logger`、`redux-thunk`、`react-native`、`babel-runtime` 以及仅服务于 Taro 2 的 Babel 插件
- 旧 ESLint/stylelint Taro 配置按模板替换

文件变更：

- 新增 `config/index.ts`、`config/dev.ts`、`config/prod.ts`（`defineConfig` 格式）
- 删除 `config/index.js`、`config/dev.js`、`config/prod.js`、`src/index.html`
- 新增 `src/app.config.ts`，页面新增 `src/pages/*/index.config.ts`
- `tsconfig.json` 按模板更新（`jsx: react-jsx`、React 18 类型）
- `project.config.json` 更新 `miniprogramRoot` 与编译设置
- `package.json` scripts 仅保留 `dev:weapp`、`build:weapp`、`upload-wx`、`typecheck`

## 页面迁移

### app

- `app.tsx` 改为默认导出的函数组件，接收并返回 `children`，删除 `Taro.render` 与 Redux `Provider`
- 页面列表、window、tabBar、`permission`、`requiredPrivateInfos` 迁入 `app.config.ts`
- 删除 alipay 分支的 tabBar 配置，保留三个 tab：分类、测试、预报
- tabBar 图标继续使用 `src/static/image` 下的资源，构建后确认 `dist` 中路径正确

### index（垃圾分类查询）

- 类组件改为函数组件 + `useState`
- `onInput` 搜索、`SeachKey` 请求、关键词列表、详情弹层逻辑保持不变
- `onShareAppMessage` 改用 `useShareAppMessage`
- 保留 `<Ad unitId='adunit-8f9c15536d079fb7' />` 及其回调
- WXML 插值写法 `className='inconImage {{item}}'`、`style='background-color:{{selectedSort.color}}'` 改为 JSX 表达式。Taro 3/4 不再为每个页面生成模板，必须改，否则 class 会变成字面量

### detail（分类详情）

- 改为函数组件，`useRouter()` 获取 `index` 参数
- 用 `useEffect` 调用 `Taro.setNavigationBarTitle`
- 数据和渲染不变

### test（小测验）

- 改为函数组件 + `useState`/`useRef`
- 模块级 `clickState` 改为 `useRef`，避免跨实例共享
- 去掉对 state 数组的直接 `push`，改为不可变更新
- 保留 `<Ad unitId='adunit-1a4ad7108719235b' />`
- `onShareAppMessage` 改用 `useShareAppMessage`
- 抽题、计分逻辑不变

### forecast（天气预报）

- 改为函数组件 + `useState`/`useEffect`
- 插屏广告的 `componentDidShow` 改为 `useDidShow`，广告实例保存在 `useRef`
- 保留广告单元 `adunit-e3b0b4a6854a07e2`
- 实时天气、7 天预报请求逻辑不变

## 错误处理（仅崩溃相关）

- 三个接口返回前，所有模板访问改为可选链或条件渲染：
  - `dataInfo.text` → `dataInfo?.text`
  - `areaInfo[0].adm2` → `areaInfo?.[0]?.adm2`
  - `data7dInfo.daily.length` → `data7dInfo?.daily?.length`
- `Taro.getLocation` 增加 `fail` 回调
- 接口请求用 `try/catch` 包裹，失败时记录错误并展示「获取天气失败，点击重试」
- 点击重试重新执行定位和请求

## 验证

1. `npm install` 成功
2. `npx tsc --noEmit` 通过
3. `npm run build:weapp` 成功
4. 检查 `dist/app.json`：页面列表、tabBar 路径、`requiredPrivateInfos`
5. `npm run dev:weapp` 后在微信开发者工具中手动验证：
   - 分类：输入关键词出列表、点击查看详情
   - 测试：答题、计分、再试一次
   - 预报：定位授权、实时天气、7 天预报、失败重试
6. 广告组件在开发者工具中允许报「无广告」错误，但不能导致页面崩溃

## 不在本次范围

- `key/` 私钥入库与 API Key 治理
- `handleTime` 补零、类型全面收紧、单元测试
- H5/支付宝/其他平台构建
- UI、交互、接口地址变更

## 风险

- Taro 4 `Ad` 组件或插屏广告 API 与 Taro 2 存在差异，以编译和开发者工具结果为准
- 微信开发者工具中的定位、广告、分享需要真实环境验证，构建通过不代表功能全部正常
- 上传私钥仍在 git 中，本次不处理，升级完成后应尽快单独修复
