const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const session = require('koa-session');
const RedisSessionStore = require('./server/session-store');
const Redis = require('ioredis');
const auth = require('./server/auth');
// 不等于production表示处于开发状态
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

// handle函数处理http请求的响应
const handle = app.getRequestHandler();

// 创建redis client
const redisClient = new Redis();

// prepare：等到pages下的页面编译完成，再去启动服务响应请求
app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();
    server.keys = ['xiaoxiao github'];
    const SESSION_CONFIG = {
        key: 'xiao',
        // maxAge: 10 * 1000, //可以设置过期时间
        store: new RedisSessionStore(redisClient)
    };
    server.use(session(SESSION_CONFIG, server));

    // 配置处理github OAuth的登录
    auth(server);

    /**
     * 如果使用路由的别名，在前端跳转没有问题，
     * 但是刷新页面会404，因为在pages下并没有对应的路由
     * 利用自己的服务（koa）做前端路由映射，解决刷新问题
     *  */
    router.get('/test/:id', async ctx => {
        const id = ctx.params.id;
        await handle(ctx.req, ctx.res, {
            pathname: '/a',
            query: { id }
        });
        ctx.respond = false;
    });

    // 前端获取用户信息接口，从session中获取并返回
    router.get('/api/user/info', async ctx => {
        const user = ctx.session.userInfo;
        if (!user) {
            ctx.status = 401;
            ctx.body = 'need login';
        } else {
            ctx.body = user;
            ctx.set('Content-Type', 'application/json');
        }
    });
    server.use(router.routes());

    /**
     * 中间件一般使用异步函数,next调用下一个中间件
     */
    server.use(async (ctx, next) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false; //禁止使用默认的响应
    });

    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
    });

    server.listen(3000, () => {
        console.log('server start success');
    });
});
