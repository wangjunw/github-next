const Koa = require("koa");
const Router = require("koa-router");
const next = require("next");
const session = require("koa-session");
const RedisSessionStore = require("./server/session-store");
const Redis = require("ioredis");

// 不等于production表示处于开发状态
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

// handle函数处理http请求的响应
const handle = app.getRequestHandler();

// 创建redis client
const redisClient = new Redis();

// prepare：等到pages下的页面编译完成，再去启动服务响应请求
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.keys = ["xiaoxiao github"];
  const SESSION_CONFIG = {
    key: "xiao",
    maxAge: 10 * 1000,
    store: new RedisSessionStore(redisClient)
  };
  server.use(session(SESSION_CONFIG, server));

  server.use(async (ctx, next) => {
    console.log("session is:", ctx.session);
    await next();
  });
  /**
   * 如果使用路由的别名，在前端跳转没有问题，
   * 但是刷新页面会404，因为在pages下并没有对应的路由
   * 利用自己的服务（koa）做前端路由映射，解决刷新问题
   *  */
  router.get("/test/:id", async ctx => {
    const id = ctx.params.id;
    await handle(ctx.req, ctx.res, {
      pathname: "/a",
      query: { id }
    });
    ctx.respond = false;
  });

  router.get("/set/user", async ctx => {
    ctx.session.user = {
      name: "xiao",
      age: 18
    };
    ctx.body = "set session success";
  });
  /**
   * 中间件一般使用异步函数,next调用下一个中间件
   */
  server.use(async (ctx, next) => {
    // ctx.cookies.set("id", "userid:xxxxx", {
    //   httpOnly: false
    // });
    await handle(ctx.req, ctx.res);
    await next();
    ctx.respond = false; //禁止使用默认的响应
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });
  server.use(router.routes());
  server.listen(3333, () => {
    console.log("success");
  });
});
