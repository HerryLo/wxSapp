# 垃圾分类助手

![version](https://img.shields.io/badge/version-1.3.0-orange)
![taro](https://img.shields.io/badge/taro-4.3.0-blue)
![react](https://img.shields.io/badge/react-18-61dafb)
![typescript](https://img.shields.io/badge/typescript-5.4-blue)
![scss](https://img.shields.io/badge/scss-1.75-pink)

> 垃圾分类查询与垃圾知识科普工具：查分类、做测验、读科普、看天气。

## 功能

- **垃圾分类查询**：按名称查询垃圾所属类别，支持搜索历史与热门搜索，依据《上海市生活垃圾分类投放指引（2024版）》。
- **分类详情**：湿垃圾、干垃圾、可回收物、有害垃圾的包含物、投放要求与延伸阅读。
- **知识科普**：12 篇本地科普文章，覆盖环境风险、处理技术、减量行动三个主题；支持收藏、文末小测与相关阅读。
- **每日内容**：今日一题、今日贴士、数据速览与热门搜索。
- **垃圾分类测验**：每轮 10 题，包含错题本、连续打卡、成绩单与分享。
- **天气预报**：实时、24 小时、7 天预报与城市搜索。
- **分享**：支持好友转发；首页支持分享到朋友圈。

## 设计

- 简约科技风 + 奶油粉主题，白色卡片搭配柔和彩色背景光斑。
- 颜色、圆角与阴影统一由 `src/styles/tech.scss` 设计令牌层提供，页面不另造令牌。
- 使用微信小程序原生 tabBar，选中态为玫瑰粉图标与文字。

## 技术栈

- Taro 4.3.0、React 18、TypeScript 5.4、SCSS
- 微信小程序原生 tabBar、微信小程序 CI（miniprogram-ci）
- 第三方垃圾分类查询接口、和风天气 API

## 目录结构

```
src/
├─ api/            # 垃圾分类、天气接口
├─ components/     # 首页与知识模块组件
├─ content/        # 知识文章与主题定义
├─ model/          # 查询与首页数据模型
├─ pages/          # 首页、分类详情、测验、天气、知识列表/详情
├─ static/         # 图片与 tabBar 图标
├─ styles/         # tech.scss 设计令牌层
└─ utils/          # 本地存储等工具
```

## 运行开发

```bash
npm install

# 微信小程序开发（监听构建）
npm run dev:weapp

# 类型检查
npm run typecheck

# 生产构建
npm run build:weapp

# 构建并调用微信小程序 CI 上传
npm run upload-wx
```

上传使用的版本号与描述读取 `package.json` 的 `wx.wxVersion` / `wx.wxDesc`，当前版本为 `1.3.0`。

## 小程序二维码

![img](https://raw.githubusercontent.com/HerryLo/wxSapp/master/img/gh_75d5a8e03369_258.jpg "二维码")

[](./img/s6x01351xerl2wqeqhpfn56_55388962.jpg)

## 说明

- 分类结果以《上海市生活垃圾管理条例》《上海市生活垃圾分类投放指引（2024版）》及当地规定为准，仅供参考。湿垃圾即厨余垃圾，干垃圾即其他垃圾；大件垃圾按《上海市大件垃圾管理办法（试行）》（2026年10月1日施行）预约清运，装修垃圾按《上海市装修垃圾规范投放及处理指引》投放，均不得混入生活垃圾分类容器。
- 垃圾分类查询使用第三方公开接口，天气数据来自和风天气。
- 个人主体小程序：当前不含评论、投稿、UGC、视频、直播与付费功能。

## 相关链接

- [个人小程序开发指南](https://juejin.im/post/5d34888b6fb9a07ef90cd68c)
- [微信小程序 CI 工具配置](https://github.com/HerryLo/wxSapp/blob/master/config/upload.wx.js)
- [微信小程序 CI 工具介绍](https://zhuanlan.zhihu.com/p/147839106)

## License

MIT
