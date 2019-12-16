#### 项目启动

先启动 redis，然后启动项目

```
node ./server.js
```

#### 功能介绍

`github OAuth授权` 、`koa集成redis`、 `数据缓存` 、`兼容客户端和服务端渲染`、`分包加载antd`、`next集成三方库`

#### npm 模块介绍

##### dependencies

-   @zeit/next-css：next 集成 css
-   @zeit/next-bundle-analyzer：分析打包出来的 js 的依赖关系，需要在 next.config.js 中配置
-   babel-plugin-import：分包导入插件
-   babel-plugin-styled-components：集成 styled-components
-   ioredis：操作 redis
-   koa-xxx：koa 相关
-   redux-xx：redux 相关
-   lru-cache：做数据缓存
-   atob：转换 base64
-   markdown-it：markdown 转成 html
-   github-markdown-css：markdown 样式优化
-   cross-env：获取环境变量

##### devDependencies

-   redux-devtools-extension：redux 调试插件
