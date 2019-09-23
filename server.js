const Koa = require("koa");
const Router = require("koa-router");
const next = require("next");

// 不等于production表示处于开发状态
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
// handle函数处理http请求的响应
const handle = app.getRequestHandler();
// prepare：等到pages下的页面编译完成，再去启动服务响应请求
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  // 前端路由映射，刷新问题
  router.get("/test/:id", async ctx => {
    const id = ctx.params.id;
    await handle(ctx.req, ctx.res, {
      pathname: "/a",
      query: { id }
    });
    ctx.respond = false;
  });
  /**
   * 中间件一般使用异步函数,next调用下一个中间件
   */
  server.use(async (ctx, next) => {
    // await handle(ctx.req, ctx.res);
    // ctx.respond = false;
    await next();
  });
  server.use(router.routes());
  server.listen(3333, () => {
    console.log("success");
  });
});
