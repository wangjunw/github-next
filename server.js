const Koa = require('koa');
const atob = require('atob');
const Router = require('koa-router');
const next = require('next');
const session = require('koa-session');
const koaBody = require('koa-body');
const RedisSessionStore = require('./server/session-store');
const Redis = require('ioredis');
const auth = require('./server/auth');
const api = require('./server/api');

// 转换base64，浏览器端自带，node端需要引入三方库
global.atob = atob;

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
    server.use(koaBody());

    server.keys = ['jw github'];
    const SESSION_CONFIG = {
        key: 'xiao',
        // maxAge: 10 * 1000, //可以设置过期时间
        store: new RedisSessionStore(redisClient)
    };
    server.use(session(SESSION_CONFIG, server));

    // 配置处理github OAuth的登录
    auth(server);
    // 处理api接口相关请求
    api(server);
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
        ctx.req.session = ctx.session;
        await handle(ctx.req, ctx.res);
        ctx.res.statusCode = 200;
        ctx.respond = false; //禁止使用默认的响应
        await next();
    });

    server.listen(3000, () => {
        console.log('server start success');
    });
});
