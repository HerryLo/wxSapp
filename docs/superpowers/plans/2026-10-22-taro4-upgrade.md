# Taro 4.3 升级实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Taro 2.2.17 微信小程序升级到 Taro 4.3.0 + React 18，页面改写为函数组件 + Hooks，并修复天气页空数据崩溃。

**Architecture:** 按 Taro 4.3 官方 React + TypeScript + Sass + Webpack5 模板重建工程配置与依赖，保留 `src` 下的 api/model/utils/static/scss，把四个页面从类组件改写为 Hooks，移除未使用的 Redux，业务逻辑和 UI 保持不变。

**Tech Stack:** Taro 4.3.0、React 18.3、TypeScript 5.4、Sass、Webpack5、Node 22、npm

**测试说明:** 项目没有测试框架，本次不引入。验证方式为逐文件 `tsc --noEmit`、生产构建 `npm run build:weapp`，以及微信开发者工具手动验收。

---

### Task 1: 升级依赖并清理 Taro 2 遗留

**Files:**
- Modify: `package.json`
- Delete: `config/index.js`、`config/dev.js`、`config/prod.js`
- Delete: `src/index.html`、`src/store/index.ts`、`src/actions/counter.ts`、`src/reducers/index.ts`、`src/reducers/counter.ts`、`src/constants/counter.ts`
- Delete: `global.d.ts`（由 Task 2 的 `types/global.d.ts` 取代）
- Delete: `yarn.lock`
- Regenerate: `package-lock.json`、`node_modules/`

- [ ] **Step 1: 用 Taro 4.3.0 依赖重写 package.json**

```json
{
  "name": "wxSapp",
  "version": "1.0.0",
  "private": true,
  "description": "垃圾分类小程序工具",
  "templateInfo": {
    "name": "default",
    "typescript": true,
    "css": "sass",
    "framework": "react"
  },
  "scripts": {
    "build:weapp": "taro build --type weapp",
    "dev:weapp": "npm run build:weapp -- --watch",
    "typecheck": "tsc --noEmit",
    "upload-wx": "npm run build:weapp && node config/upload.wx.js"
  },
  "browserslist": [
    "defaults and fully supports es6-module",
    "maintained node versions"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@babel/runtime": "^7.24.4",
    "@tarojs/components": "4.3.0",
    "@tarojs/helper": "4.3.0",
    "@tarojs/plugin-framework-react": "4.3.0",
    "@tarojs/plugin-platform-weapp": "4.3.0",
    "@tarojs/react": "4.3.0",
    "@tarojs/runtime": "4.3.0",
    "@tarojs/shared": "4.3.0",
    "@tarojs/taro": "4.3.0",
    "miniprogram-ci": "^2.1.31",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@babel/core": "^7.24.4",
    "@babel/plugin-transform-class-properties": "7.25.9",
    "@babel/preset-react": "^7.24.1",
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.5",
    "@tarojs/cli": "4.3.0",
    "@tarojs/plugin-generator": "4.3.0",
    "@tarojs/taro-loader": "4.3.0",
    "@tarojs/webpack5-runner": "4.3.0",
    "@types/node": "^18",
    "@types/react": "^18.0.0",
    "@types/webpack-env": "^1.13.6",
    "babel-preset-taro": "4.3.0",
    "eslint": "^8.57.0",
    "eslint-config-taro": "4.3.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.4.0",
    "postcss": "^8.5.6",
    "react-refresh": "^0.14.0",
    "sass": "^1.75.0",
    "tsconfig-paths-webpack-plugin": "^4.1.0",
    "typescript": "^5.4.5",
    "webpack": "5.91.0"
  },
  "wx": {
    "wxVersion": "1.1.11",
    "wxDesc": "Taro 4.3 升级；天气接口请求升级；天气界面样式修改"
  }
}
```

- [ ] **Step 2: 删除 Taro 2 配置、Redux 和旧锁文件**

```bash
git rm -q config/index.js config/dev.js config/prod.js
git rm -q src/index.html yarn.lock global.d.ts
git rm -q src/store/index.ts src/actions/counter.ts
git rm -q src/reducers/index.ts src/reducers/counter.ts
git rm -q src/constants/counter.ts
```

- [ ] **Step 3: 清理旧依赖并安装**

```bash
rm -rf node_modules package-lock.json
npm install
```

Expected: 安装退出码 0，无 `ERESOLVE` 报错。

- [ ] **Step 4: 验证 Taro CLI 版本**

Run: `node -p "require('@tarojs/cli/package.json').version"`
Expected: `4.3.0`

- [ ] **Step 5: 提交**

```bash
git add package.json package-lock.json
git commit -m "chore 升级到 Taro 4.3.0 并移除 Taro2/Redux 依赖"
```

---

### Task 2: 重建构建配置与类型声明

**Files:**
- Create: `config/index.ts`、`config/dev.ts`、`config/prod.ts`、`babel.config.js`
- Create: `types/global.d.ts`
- Modify: `tsconfig.json`、`.eslintrc`、`project.config.json`
- Modify: `src/type/index.d.ts`、`src/api/seach.api.ts`

- [ ] **Step 1: 创建 config/index.ts**

```ts
import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import devConfig from './dev'
import prodConfig from './prod'

export default defineConfig<'webpack5'>(async (merge) => {
  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'WxSapp',
    date: '2026-10-22',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-generator'],
    defineConstants: {},
    copy: {
      patterns: [
        {
          from: 'src/static',
          to: 'dist/static'
        }
      ],
      options: {}
    },
    framework: 'react',
    compiler: 'webpack5',
    cache: {
      enable: false
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})
```

- [ ] **Step 2: 创建 config/dev.ts 和 config/prod.ts**

`config/dev.ts`:

```ts
export default {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {},
  mini: {}
}
```

`config/prod.ts`:

```ts
export default {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {},
  mini: {}
}
```

- [ ] **Step 3: 创建 babel.config.js**

```js
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
      compiler: 'webpack5'
    }]
  ]
}
```

- [ ] **Step 4: 创建 types/global.d.ts**

```ts
/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production',
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'qq' | 'jd' | 'harmony' | 'jdrn'
    TARO_APP_ID: string
  }
}
```

- [ ] **Step 5: 重写 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "removeComments": false,
    "preserveConstEnums": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "noImplicitAny": false,
    "allowSyntheticDefaultImports": true,
    "outDir": "lib",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strictNullChecks": true,
    "sourceMap": true,
    "rootDir": ".",
    "jsx": "react-jsx",
    "allowJs": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "typeRoots": [
      "node_modules/@types"
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["./src", "./types", "./config"],
  "compileOnSave": false
}
```

- [ ] **Step 6: 更新 .eslintrc**

```json
{
  "extends": ["taro/react"],
  "rules": {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

- [ ] **Step 7: 更新 project.config.json**

```json
{
  "miniprogramRoot": "./dist",
  "projectname": "WxSapp",
  "description": "垃圾分类小程序工具",
  "appid": "wx6a0b834a3839e80d",
  "setting": {
    "urlCheck": true,
    "es6": false,
    "enhance": false,
    "compileHotReLoad": false,
    "postcss": false,
    "minified": false
  },
  "compileType": "miniprogram"
}
```

- [ ] **Step 8: 清理 type/index.d.ts 中依赖旧包的无用导入**

把文件开头的两行删除：

```ts
import { strict } from "assert";
import { string, number } from "prop-types";
```

删除后文件应以 `export interface SelectedSort {` 开头。

- [ ] **Step 9: 清理 seach.api.ts 中未使用的导入**

把：

```ts
import { RequestUrl, WeatherUrl, QweatherKey } from '../constants/config'
```

改为：

```ts
import { RequestUrl } from '../constants/config'
```

- [ ] **Step 10: 验证构建配置可被 TypeScript 解析**

Run:

```bash
npx tsc --noEmit --skipLibCheck --module commonjs --moduleResolution node --target es2017 --allowSyntheticDefaultImports types/global.d.ts config/index.ts config/dev.ts config/prod.ts
```

Expected: 无输出，退出码 0。

- [ ] **Step 11: 提交**

```bash
git add config babel.config.js types tsconfig.json .eslintrc project.config.json src/type/index.d.ts src/api/seach.api.ts
git commit -m "chore 重建 Taro 4 构建配置与类型声明"
```

---

### Task 3: 迁移 App 入口与页面配置

**Files:**
- Modify: `src/app.tsx`
- Create: `src/app.config.ts`
- Create: `src/pages/index/index.config.ts`、`src/pages/forecast/forecast.config.ts`、`src/pages/detail/detail.config.ts`、`src/pages/test/test.config.ts`

- [ ] **Step 1: 重写 src/app.tsx**

```tsx
import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'

import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  return children
}

export default App
```

- [ ] **Step 2: 创建 src/app.config.ts**

```ts
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/forecast/forecast',
    'pages/detail/detail',
    'pages/test/test'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#eee',
    selectedColor: '#49a9ee',
    backgroundColor: '#ffffff',
    list: [
      {
        text: '分类',
        iconPath: 'static/image/outline_home_black_18.png',
        selectedIconPath: 'static/image/round_home_black_18.png',
        pagePath: 'pages/index/index'
      },
      {
        text: '测试',
        iconPath: 'static/image/outline_visibility_black_18.png',
        selectedIconPath: 'static/image/round_visibility_black_18.png',
        pagePath: 'pages/test/test'
      },
      {
        text: '预报',
        iconPath: 'static/image/outline_cloud_black_18.png',
        selectedIconPath: 'static/image/round_cloud_black_18.png',
        pagePath: 'pages/forecast/forecast'
      }
    ]
  },
  permission: {
    'scope.userLocation': {
      desc: '允许智吱声访问您当前的地理位置信息？'
    }
  },
  requiredPrivateInfos: ['getLocation']
})
```

- [ ] **Step 3: 创建四个页面配置文件**

`src/pages/index/index.config.ts`:

```ts
export default definePageConfig({
  navigationBarTitleText: '垃圾分类助手',
  navigationBarTextStyle: 'white',
  navigationBarBackgroundColor: '#2c7cf7'
})
```

`src/pages/forecast/forecast.config.ts`:

```ts
export default definePageConfig({
  navigationBarTitleText: '天气预报',
  navigationBarTextStyle: 'white',
  navigationBarBackgroundColor: '#2c7cf7'
})
```

`src/pages/detail/detail.config.ts`:

```ts
export default definePageConfig({
  navigationBarTitleText: '',
  navigationBarTextStyle: 'white',
  navigationBarBackgroundColor: '#2c7cf7'
})
```

`src/pages/test/test.config.ts`:

```ts
export default definePageConfig({
  navigationBarTitleText: '小测试',
  navigationBarTextStyle: 'white',
  navigationBarBackgroundColor: '#2c7cf7'
})
```

- [ ] **Step 4: 验证 App 与配置类型**

Run:

```bash
npx tsc --noEmit --jsx react-jsx --skipLibCheck --module commonjs --moduleResolution node --target es2017 --allowSyntheticDefaultImports --esModuleInterop --strictNullChecks types/global.d.ts src/app.tsx src/app.config.ts src/pages/index/index.config.ts src/pages/forecast/forecast.config.ts src/pages/detail/detail.config.ts src/pages/test/test.config.ts
```

Expected: 无输出，退出码 0。

- [ ] **Step 5: 提交**

```bash
git add src/app.tsx src/app.config.ts src/pages/index/index.config.ts src/pages/forecast/forecast.config.ts src/pages/detail/detail.config.ts src/pages/test/test.config.ts
git commit -m "feat 迁移 App 入口与页面配置到 Taro 4"
```

---

### Task 4: 首页改写为函数组件

**Files:**
- Modify: `src/pages/index/index.tsx`

- [ ] **Step 1: 用下面的完整内容替换 `src/pages/index/index.tsx`**

```tsx
import { useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Icon, Input, Button, Text, Ad } from '@tarojs/components'
import { SeachKey } from '../../api/index'
import IndexModel from '../../model/index/index'
import { SelectedSort } from '../../type/index'
import { ITouchEvent } from '@tarojs/components/types/common'

import './index.scss'

interface KwArrData {
  CssName: string
  Name: string
  Note: string
  QueryCount: number | null
  TargetId: string
  TypeKey: string
}

const IMG_LIST = ['ico-3', 'ico-4', 'ico-2', 'ico-1']

function Index() {
  const [search, setSearch] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [kwArr, setKwArr] = useState<KwArrData[]>([])
  const [selectedSort, setSelectedSort] = useState<SelectedSort | null>(null)

  useShareAppMessage(() => ({ title: '垃圾分类助手' }))

  const clear = () => {
    setKeywords([])
    setSearch('')
  }

  const seach = async (e: any) => {
    const str: string = e.detail.value
    if (!str) {
      clear()
      return
    }
    setSearch(str)
    const res = await SeachKey({ keyword: str })
    if (res) {
      setKeywords(res.data.kw_list || [])
      setKwArr(res.data.kw_arr || [])
    }
  }

  const searchSort = (e: ITouchEvent) => {
    const keyword = e.currentTarget.dataset.keyword as string
    const data = kwArr.find(item => item.Name === keyword)
    if (data) {
      const index = IndexModel.handleCssName(data.CssName)
      setSelectedSort(IndexModel.getSort(index))
    }
  }

  const dismiss = () => {
    setSelectedSort(null)
  }

  const routeGo = (e: ITouchEvent) => {
    const { link, index } = e.currentTarget.dataset
    Taro.navigateTo({
      url: `${link}?index=${index}`
    })
  }

  return (
    <View className='index-container'>
      <View className='searchFiled'>
        <Icon type='search' color='rgb(156, 156, 156)' />
        <Input
          className='input'
          placeholder='输入垃圾名称'
          confirmType='search'
          onInput={seach}
          value={search}
        />
        <View onClick={clear} className='icon'>
          <Icon type='cancel' color='rgb(156, 156, 156)' />
        </View>
      </View>
      {
        keywords.length !== 0 && keywords.map((item, index) => {
          return (
            <View className='searchList' key={index}>
              <View
                className='searchCell'
                onClick={searchSort}
                data-keyword={item}
              >
                {item}
              </View>
              <View className='line'></View>
            </View>
          )
        })
      }
      {
        keywords.length === 0 &&
          <View className='img-container'>
            {
              IMG_LIST.map((item, index) => {
                return (
                  <View
                    key={index}
                    onClick={routeGo}
                    data-link='/pages/detail/detail'
                    data-index={index}
                    className={'inconImage ' + item}
                  >
                  </View>
                )
              })
            }
          </View>
      }
      {
        selectedSort !== null &&
          <View className='resultback' onClick={dismiss}>
            <View className='resultView'>
              <View className='resultHead'>
                {selectedSort.name}
              </View>
              <View className='desView'>
                <View
                  className={'bigIcon ' + selectedSort.iconClass}
                  style={{ backgroundColor: selectedSort.color }}
                ></View>
                {selectedSort.des}
              </View>
              {
                selectedSort.inc &&
                  <View className='title'>
                    {selectedSort.name}主要包括
                  </View>
              }
              <View className='des'>
                {selectedSort.inc}
              </View>
              {
                selectedSort.req &&
                  <View className='title'>
                    {selectedSort.name}投放要求
                  </View>
              }
              <View className='des'>
                {selectedSort.req}
              </View>
            </View>
          </View>
      }
      {
        keywords.length === 0 &&
          <View className='desc'>
            工具说明: 上海垃圾分类查询小工具，2019年7月1日,《上海市生活垃圾管理条例》正式实施，生活垃圾按照
            <Text>"可回收物"、"有害垃圾"、"湿垃圾"、"干垃圾"</Text>
            的分类标准。
          </View>
      }
      <Button className='button' openType='share'>
        分享
      </Button>
      <Ad
        unitId='adunit-8f9c15536d079fb7'
        onLoad={() => console.log('ad onLoad')}
        onError={() => console.log('ad onError')}
        onClose={() => console.log('ad onClose')}
      />
    </View>
  )
}

export default Index
```

- [ ] **Step 2: 单文件类型检查**

Run:

```bash
npx tsc --noEmit --jsx react-jsx --skipLibCheck --module commonjs --moduleResolution node --target es2017 --allowSyntheticDefaultImports --esModuleInterop --strictNullChecks --noUnusedLocals --noUnusedParameters types/global.d.ts src/pages/index/index.tsx
```

Expected: 无输出，退出码 0。若报 `data-link`/`data-index` 不存在，在 View 上使用 `{...{ 'data-link': '/pages/detail/detail', 'data-index': index }}` 形式替代。

- [ ] **Step 3: 提交**

```bash
git add src/pages/index/index.tsx
git commit -m "feat 首页迁移为函数组件"
```

---

### Task 5: 详情页改写为函数组件

**Files:**
- Modify: `src/pages/detail/detail.tsx`

- [ ] **Step 1: 用下面的完整内容替换 `src/pages/detail/detail.tsx`**

```tsx
import { useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './detail.scss'

const NAMES = ['湿垃圾', '干垃圾', '可回收物', '有害垃圾']
const ICON_CLASS = ['ico-3', 'ico-4', 'ico-2', 'ico-1']
const DES = [
  '是指日常生活垃圾产生的容易腐烂的生物质废弃物。',
  '是指除有害垃圾、可回收物、湿垃圾以外的其他生活废弃物。',
  '是指适宜回收利用和资源化利用的，如：玻、金、塑、 纸、衣。',
  '是指对人体健康或者自然环境造成直接或潜在危害的废弃物。',
  '建筑装修产生的垃圾, 不能直接丢入垃圾桶，需要投入专门的建筑垃圾桶或联系物业处理',
  '体积较大、整体性强，需要拆分再处理的废弃物品'
]
const INCS = [
  '包括食材废料，剩菜剩饭、瓜皮果核、花卉绿植、过期食品等易腐生活废弃物。',
  '包括餐盒、餐巾纸、湿纸巾、卫生间用纸、塑料袋、食品包装袋、污染严重的纸、烟蒂、纸尿裤、一次性杯子、大骨头、贝壳、花盆、陶瓷等。',
  '包括酱油瓶、玻璃杯、平板玻璃、易拉罐、饮料瓶、洗发水瓶、塑料玩具、书本、报纸、广告单、纸板箱、衣服、床上用品等。',
  '包括废电池、油漆桶、荧光灯管、废药品及其包装物等。'
]
const REQS = [
  '产生时与其他垃圾分开收集，尽量沥干水分，有包装物的湿垃圾应将包装物去除后分类投放，包装物请投放到对应的可回收物或干垃圾容器。',
  '放入干垃圾收集器，并保持周边环境整洁。',
  '轻投轻放、清洁干燥，避免污染。废纸尽量平整。立体包装物请清空内容物，清洁后压扁投放。有尖锐边角的，应包裹后投放。',
  '投放时请注意轻放。易破损的请连带包装或包裹后轻放，如易挥发，请密封后投放。'
]

function Detail() {
  const router = useRouter()
  const index = Number(router.params.index || 0)

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: NAMES[index]
    })
  }, [index])

  return (
    <View>
      <View className='container'>
        <View className={ICON_CLASS[index] + ' inconImage'}></View>
        <View className='title'>
          <Text>{NAMES[index]}</Text>{DES[index]}
        </View>
        <View className='require'>主要内容:</View>
        <View className='requireDesc'>💡 {INCS[index]}</View>
        <View className='require'>投放要求:</View>
        <View className='requireDesc'>💡 {REQS[index]}</View>
      </View>
    </View>
  )
}

export default Detail
```

- [ ] **Step 2: 单文件类型检查**

Run:

```bash
npx tsc --noEmit --jsx react-jsx --skipLibCheck --module commonjs --moduleResolution node --target es2017 --allowSyntheticDefaultImports --esModuleInterop --strictNullChecks --noUnusedLocals --noUnusedParameters types/global.d.ts src/pages/detail/detail.tsx
```

Expected: 无输出，退出码 0。

- [ ] **Step 3: 提交**

```bash
git add src/pages/detail/detail.tsx
git commit -m "feat 详情页迁移为函数组件"
```

---

### Task 6: 测验页改写为函数组件

**Files:**
- Modify: `src/pages/test/test.tsx`

- [ ] **Step 1: 用下面的完整内容替换 `src/pages/test/test.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Text, Button, Ad } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'
import { randomArray } from '../../utils/util'
import { result } from '../../static/result'

import './test.scss'

interface ResultProp {
  a: string
  c: string
  i: string
  n: string
}

const RANDOM_NUMBER = 10
const NAMES = ['湿垃圾', '干垃圾', '可回收物', '有害垃圾']
const ICON_CLASS = ['ico-1', 'ico-2', 'ico-3', 'ico-4']

function Test() {
  const clickState = useRef(true)
  const [arrResult, setArrResult] = useState<ResultProp[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [index, setIndex] = useState(-1)
  const [resultIndexList, setResultIndexList] = useState<number[]>([])
  const [grade, setGrade] = useState(0)

  useShareAppMessage(() => ({ title: '垃圾分类统一考试' }))

  const dataInit = () => {
    const { data } = result
    const list = [1, 2, 3, 4]
    const arr = randomArray<number>(list, RANDOM_NUMBER)
    const nextResult = arr.reduce<ResultProp[]>((acc, i) => {
      return acc.concat(randomArray<ResultProp>(data[i], 1))
    }, [])
    setArrResult(nextResult)
    setIndex(-1)
    setGrade(0)
    setCurrentIndex(0)
    setResultIndexList([])
  }

  useEffect(() => {
    dataInit()
  }, [])

  const clickCard = (e: ITouchEvent) => {
    if (!clickState.current) return
    clickState.current = false
    const { currentindex, index: cardIndex } = e.currentTarget.dataset
    const nextCurrentIndex = Number(currentindex) + 1
    const selected = Number(cardIndex)
    setIndex(selected)
    setTimeout(() => {
      const nextList = [...resultIndexList, selected]
      setResultIndexList(nextList)
      setIndex(-1)
      setCurrentIndex(nextCurrentIndex)
      setTimeout(() => {
        clickState.current = true
      }, 200)
      if (nextCurrentIndex === 10) {
        let nextGrade = 0
        nextList.forEach((item, i) => {
          if (item + 1 === Number(arrResult[i].c)) {
            nextGrade += 10
          }
        })
        setGrade(nextGrade)
      }
    }, 300)
  }

  const routerGo = (e: ITouchEvent) => {
    Taro.reLaunch({
      url: e.currentTarget.dataset.link
    })
  }

  const ci = currentIndex < 9 ? '0' + (currentIndex + 1) : currentIndex + 1

  return (
    <View className='container'>
      <View
        className='icon_Swiper'
        style={{
          transform: `translateX(-${currentIndex * 100}vw)`,
          transition: '0.3s'
        }}
      >
        {arrResult.map((item, ids) => {
          return (
            <View key={ids} className='icon_list'>
              <View className='number'>
                <Text>{ci}</Text> / 10
              </View>
              <View className='title'>{item.n}</View>
              {ICON_CLASS.map((iconClass, ins) => {
                return (
                  <View
                    key={ins}
                    data-index={ins}
                    data-currentindex={ids}
                    onClick={clickCard}
                    className={
                      (index === ins ? 'active' : '') + ' card_Info'
                    }
                  >
                    <View className={iconClass + ' inconImage'}></View>
                    <View className='name'>{NAMES[ins]}</View>
                  </View>
                )
              })}
            </View>
          )
        })}
        <View className='resultList'>
          <View className='resultList-title'>成绩单</View>
          {arrResult.map((item, resultIndex) => {
            const seletype = resultIndexList[resultIndex]
            return (
              <View className='result-item' key={item.i}>
                <View className='name'>{item.n}</View>
                <View className='typeResult'>
                  <View className='type'>{NAMES[Number(item.c) - 1]}</View>
                  <View className='result'>
                    {NAMES[seletype] === NAMES[Number(item.c) - 1] ? (
                      '✔'
                    ) : (
                      <Text>{NAMES[seletype]}</Text>
                    )}
                  </View>
                </View>
              </View>
            )
          })}
          <View className='grade'>分数：{grade}</View>
          <View className='btnList'>
            <View className='btn1' onClick={dataInit}>
              再试一次
            </View>
            <Button className='btn2' openType='share'>
              考考别人
            </Button>
          </View>
          <View
            className='foot'
            onClick={routerGo}
            data-link='/pages/index/index'
          >
            更多垃圾分类
          </View>
        </View>
      </View>
      <Button className='button' openType='share'>
        分享
      </Button>
      <Ad
        unitId='adunit-1a4ad7108719235b'
        onLoad={() => console.log('ad onLoad')}
        onError={() => console.log('ad onError')}
        onClose={() => console.log('ad onClose')}
      />
    </View>
  )
}

export default Test
```

- [ ] **Step 2: 单文件类型检查**

Run:

```bash
npx tsc --noEmit --jsx react-jsx --skipLibCheck --module commonjs --moduleResolution node --target es2017 --allowSyntheticDefaultImports --esModuleInterop --strictNullChecks --noUnusedLocals --noUnusedParameters types/global.d.ts src/pages/test/test.tsx
```

Expected: 无输出，退出码 0。若 `data-index` 等属性报类型错误，改用展开形式 `{...{ 'data-index': ins, 'data-currentindex': ids }}`。

- [ ] **Step 3: 提交**

```bash
git add src/pages/test/test.tsx
git commit -m "feat 测验页迁移为函数组件"
```

---

### Task 7: 预报页改写为函数组件并修复空数据崩溃

**Files:**
- Modify: `src/pages/forecast/forecast.tsx`
- Modify: `src/pages/forecast/forecast.scss`

- [ ] **Step 1: 用下面的完整内容替换 `src/pages/forecast/forecast.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import { RealTimeWeather, SearchCity, WeatherV7d } from '../../api/index'
import { handleTime } from '../../utils/util'

import './forecast.scss'

interface AreaInfo {
  adm2?: string
  name?: string
}

interface WeatherNow {
  text?: string
  temp?: string
  feelsLike?: string
  windDir?: string
  windSpeed?: string
  obsTime?: string
  humidity?: string
  vis?: string
  [key: string]: any
}

interface DailyWeather {
  fxDate: string
  tempMin: string
  tempMax: string
  textDay: string
  textNight: string
  sunrise: string
  sunset: string
}

interface Weather7d {
  daily?: DailyWeather[]
  updateTime?: string
}

function ForeCast() {
  const [dataInfo, setDataInfo] = useState<WeatherNow | null>(null)
  const [areaInfo, setAreaInfo] = useState<AreaInfo[] | null>(null)
  const [data7dInfo, setData7dInfo] = useState<Weather7d | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const interstitialAd = useRef<any>(null)

  useShareAppMessage(() => ({ title: '天气预报' }))

  const weather = async () => {
    setLoading(true)
    setError('')
    try {
      const location = await Taro.getLocation({ type: 'wgs84' })
      const { latitude, longitude } = location
      const areaRes = await SearchCity({
        location: `${longitude},${latitude}`
      })
      const weatherRes = await RealTimeWeather({
        location: `${longitude},${latitude}`
      })
      const weather7dRes = await WeatherV7d({
        location: `${longitude},${latitude}`
      })
      setDataInfo(weatherRes.data.now)
      setAreaInfo(areaRes.data.location)
      setData7dInfo(weather7dRes.data)
    } catch (err) {
      console.error('获取天气失败', err)
      setError('获取天气失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    weather()
  }, [])

  useDidShow(() => {
    if ((Taro as any).createInterstitialAd && !interstitialAd.current) {
      const ad = Taro.createInterstitialAd({
        adUnitId: 'adunit-e3b0b4a6854a07e2'
      })
      ad.onLoad(() => {})
      ad.onError((err) => {
        console.error('插屏广告加载失败', err)
      })
      ad.onClose(() => {})
      interstitialAd.current = ad
    }

    if (interstitialAd.current) {
      interstitialAd.current.show().catch((err: any) => {
        console.error('插屏广告显示失败', err)
      })
    }
  })

  return (
    <View className='forecast'>
      <View className='top'>
        <View style='height: 80rpx;'></View>
        <View className='currentWind'>
          {dataInfo?.text || '--'} {dataInfo?.temp || '--'}℃
        </View>
        <View className='weatherDesc padding'>
          体感温度 {dataInfo?.feelsLike || '--'}℃
        </View>
        <View className='temperature padding'>风向 {dataInfo?.windDir || '--'}</View>
        <View className='temperature padding'>风速 {dataInfo?.windSpeed || '--'}公里/小时</View>
        <View className='time'>
          <View>
            {dataInfo?.obsTime ? handleTime(dataInfo.obsTime) : '--'}
          </View>
          <View>
            {areaInfo?.[0]?.adm2} {areaInfo?.[0]?.name}
          </View>
        </View>
      </View>
      {loading && <View className='loading'>加载中...</View>}
      {error && (
        <View className='loading' onClick={weather}>
          {error}，点击重试
        </View>
      )}
      <View className='list'>
        <View className='list-item'>
          <Text>相对湿度 {dataInfo?.humidity || '--'}%</Text>
        </View>
        <View className='list-item'>
          <Text>能见度 {dataInfo?.vis || '--'}公里</Text>
        </View>
      </View>
      {data7dInfo?.daily && data7dInfo.daily.length > 0 && (
        <ScrollView className='scrollView' scrollX={true}>
          <View className='card'>
            {data7dInfo.daily.map((item, index) => {
              return (
                <View className='card-item' key={index}>
                  <View className='title'>{item.fxDate}</View>
                  <View className='desc'>温度：{item.tempMin}℃~{item.tempMax}℃</View>
                  <View className='desc'>白天： {item.textDay}</View>
                  <View className='desc'>夜间： {item.textNight}</View>
                  <View className='desc'>日出： {item.sunrise}</View>
                  <View className='desc'>日落： {item.sunset}</View>
                </View>
              )
            })}
          </View>
        </ScrollView>
      )}
      {data7dInfo?.updateTime && (
        <View className='updateTime7d'>7天天气更新：{handleTime(data7dInfo.updateTime)}</View>
      )}
      <Button className='button' openType='share'>
        分享
      </Button>
    </View>
  )
}

export default ForeCast
```

- [ ] **Step 2: 在 forecast.scss 末尾追加加载提示样式**

在 `src/pages/forecast/forecast.scss` 最后一个 `}` 之后追加：

```scss
.loading {
  padding: 40rpx;
  text-align: center;
  color: #666;
  font-size: 28rpx;
}
```

- [ ] **Step 3: 单文件类型检查**

Run:

```bash
npx tsc --noEmit --jsx react-jsx --skipLibCheck --module commonjs --moduleResolution node --target es2017 --allowSyntheticDefaultImports --esModuleInterop --strictNullChecks --noUnusedLocals --noUnusedParameters types/global.d.ts src/pages/forecast/forecast.tsx
```

Expected: 无输出，退出码 0。

- [ ] **Step 4: 提交**

```bash
git add src/pages/forecast/forecast.tsx src/pages/forecast/forecast.scss
git commit -m "feat 预报页迁移为函数组件并修复空数据崩溃"
```

---

### Task 8: 全量校验与构建

**Files:**
- Verify: 全项目

- [ ] **Step 1: 全量类型检查**

Run: `npm run typecheck`
Expected: 无输出，退出码 0。

若报错，按错误文件修复：未使用变量删除、类型不匹配按 Taro 4 类型调整，不改变业务行为。

- [ ] **Step 2: 生产构建**

Run: `npm run build:weapp`
Expected: 构建成功，生成 `dist/`，无 `Module not found` 或 `Bindings not found`。

如果出现 `Bindings not found`，执行：

```bash
rm -rf node_modules package-lock.json
npm install
npm run build:weapp
```

- [ ] **Step 3: 检查产物配置**

Run: `cat dist/app.json`
Expected: `pages` 包含四个页面；`tabBar.list` 三项的 `iconPath` 为 `static/image/...`；包含 `requiredPrivateInfos: ["getLocation"]`。

Run: `ls dist/static/image`
Expected: 能看到 tabBar 使用的 `outline_home_black_18.png` 等文件。

- [ ] **Step 4: 提交构建修复（如有）**

```bash
git status --short
git add -u
git commit -m "fix 修复 Taro 4 全量类型检查与构建问题"
```

- [ ] **Step 5: 手动验收（需要用户操作）**

```bash
npm run dev:weapp
```

用微信开发者工具打开 `dist`，逐项确认：

- 分类：输入「电池」「纸箱」等关键词出现列表；点击结果出现详情弹层；点击四个分类图标进入详情页
- 测试：完成 10 题后显示成绩单；「再试一次」重新抽题
- 预报：允许定位后显示实时天气与 7 天预报；拒绝定位时显示「获取天气失败」且可点击重试
- 三个 tab 切换正常；广告位报「无广告」不影响页面

---

## 回滚方案

升级分支为 `feat/taro4`，master 未改动。若升级失败：

```bash
git checkout master
```

`feat/taro4` 分支保留，可随时切回继续修复。
