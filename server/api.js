/**
 * 请求github相关api接口的中间转发，避免客户端直接请求暴露出去
 */
const axios = require("axios");
const config = require("../config/config");
module.exports = server => {
  server.use(async (ctx, next) => {
    const { path } = ctx;
    // 只处理github相关请求
    if (path.startsWith("/github/")) {
      const githubAuth = ctx.session && ctx.session.githubAuth;

      // 获取真实的api请求接口
      const githubApiUrl = `${config.github.api_base_url}${ctx.url.replace(
        "/github",
        ""
      )}`;

      // 判断有token就添加到headers中
      const token = githubAuth && githubAuth.access_token;

      let headers = {};
      if (token) {
        headers["Authorization"] = `${githubAuth.token_type} ${token}`;
      }
      try {
        const result = await axios({
          url: githubApiUrl,
          method: "GET",
          headers
        });
        if (result.status === 200) {
          ctx.body = result.data;
          ctx.set("Content-Type", "application/json");
        } else {
          ctx.status = result.status;
          ctx.body = {
            success: false
          };
          ctx.set("Content-Type", "application/json");
        }
      } catch (err) {
        console.log(err);
        ctx.body = {
          success: false
        };
      }
    } else {
      await next();
    }
  });
};
