/**
 * next整体配置文件，可以修改next的一些默认配置
 * next默认不支持引入css文件，所以需要使用插件让其支持
 * */

const withCss = require("@zeit/next-css");
const configs = {
  distDir: "dist", //编译文件输出目录
  generateEtags: true, //是否给每个路由生成etag
  onDemandEntries: {
    //页面内容缓存配置
    maxInactiveAge: 25 * 1000, //页面在内存中缓存的时间
    pagesBufferLength: 2 // 同时缓存的页面数
  },
  pageExtensions: ["jsx", "js"], //在page目录下，那种后缀的文件被认为是页面
  // 配置buildId
  generateBuildId: async () => {
    if (process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID;
    }
    // 返回null使用默认unique id
    return null;
  },
  webpack(config, options) {
    return config;
  }, //修改默认的webpack配置
  webpackDevMiddleware: config => {
    return config;
  }, //修改webpackDevMiddleware配置
  env: {
    customKey: "value" //在页面中可以通过process.env.customKey获取value
  },
  // 只有在服务器渲染有效，在页面通过'next/config'来读取
  serverRuntimeConfig: {
    mySecret: "secret",
    secondSecret: process.env.SECOND_SECRET
  },
  // 在服务器渲染和客户端渲染都可以获取配置
  publicRuntimeConfig: {
    staticFolder: "/static"
  }
};
if (typeof require !== "undefined") {
  require.extensions[".css"] = file => {};
}
module.exports = withCss({});
