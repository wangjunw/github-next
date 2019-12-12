const axios = require("axios");
const config = require("../config/config");
const { client_id, client_secret, request_token_url } = config.github;
module.exports = server => {
  server.use(async (ctx, next) => {
    // 如果是认证页面
    if (ctx.path === "/auth") {
      const code = ctx.query.code;
      if (!code) {
        ctx.body = "code not exist";
        return;
      }
      const result = await axios({
        method: "POST",
        url: request_token_url,
        data: {
          client_id,
          client_secret,
          code
        },
        headers: {
          Accept: "application/json"
        }
      });
      if (result.status === 200 && result.data && !result.data.error) {
        ctx.session.githubAuth = result.data;
        const { access_token, token_type } = result.data;
        const userInfoRes = await axios({
          method: "GET",
          url: "https://api.github.com/user",
          headers: {
            Authorization: `${token_type} ${access_token}`
          }
        });
        // 把获取到的用户信息存到session
        ctx.session.userInfo = userInfoRes.data;
        ctx.redirect(
          ctx.session && ctx.session.beforeOAuthUrl
            ? ctx.session.beforeOAuthUrl
            : "/"
        );
        ctx.session.beforeOAuthUrl = "";
      } else {
        const errorMsg = result.data && result.data.error;
        ctx.body = `request token failed ${errorMsg}`;
      }
    } else {
      await next();
    }
  });

  // 登出
  server.use(async (ctx, next) => {
    const { path, method } = ctx;
    if (path === "/logout" && method === "POST") {
      ctx.session = null;
      ctx.body = "logout success";
    } else {
      await next();
    }
  });

  /**
   * 存储点击授权时所在的页面，授权完成后返回该页面
   */
  server.use(async (ctx, next) => {
    const { path, method } = ctx;
    if (path === "/prepare-auth" && method === "GET") {
      const { url } = ctx.query;
      ctx.session.beforeOAuthUrl = url;
      ctx.body = "ready";
    } else {
      await next();
    }
  });
};
