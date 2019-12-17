#### 项目启动

开发环境先启动 redis，然后启动项目

```
redis-server
node ./server.js
```

生产环境可通过 pm2 启动，先安装安装 pm2，ecosystem.config.js 为 pm2 配置文件

```
pm2 start ecosystem.config.js
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
-   lodash：常用工具库(防抖函数)

##### devDependencies

-   redux-devtools-extension：redux 调试插件
