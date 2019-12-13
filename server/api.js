/**
 * 请求github相关api接口的中间转发，避免客户端直接请求暴露出去
 */
const { requestGithub } = require("../libs/api");
module.exports = server => {
  server.use(async (ctx, next) => {
    const { path } = ctx;
    // 只处理github相关请求
    if (path.startsWith("/github/")) {
      const githubAuth = ctx.session && ctx.session.githubAuth;

      // 判断有token就添加到headers中
      const token = githubAuth && githubAuth.access_token;

      let headers = {};
      if (token) {
        headers["Authorization"] = `${githubAuth.token_type} ${token}`;
      }
      const method = ctx.method;
      const result = await requestGithub(
        ctx.url.replace("/github/", "/"),
        method,
        ctx.request.body || {},
        headers
      );
      ctx.status = result.status;
      ctx.body = result.data;
    } else {
      await next();
    }
  });
};
