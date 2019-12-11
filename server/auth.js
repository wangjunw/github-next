const axios = require('axios');
const config = require('../config/config');
const { client_id, client_secret, request_token_url } = config.github;
module.exports = server => {
    server.use(async (ctx, next) => {
        // 如果是认证页面
        if (ctx.path === '/auth') {
            const code = ctx.query.code;
            if (!code) {
                ctx.body = 'code not exist';
                return;
            }
            const result = await axios({
                method: 'POST',
                url: request_token_url,
                data: {
                    client_id,
                    client_secret,
                    code
                },
                headers: {
                    Accept: 'application/json'
                }
            });
            console.log('result111', result);
            if (result.status === 200 && result.data && !result.data.error) {
                ctx.session.githubAuth = result.data;
                const { access_token, token_type } = result.data;
                const userInfoRes = await axios({
                    method: 'GET',
                    url: 'https://api.github.com/user',
                    headers: {
                        Authorization: `${token_type} ${access_token}`
                    }
                });
                console.log(userInfoRes.data);
                // 把获取到的用户信息存到session
                ctx.session.userInfo = userInfoRes.data;
                ctx.redirect('/');
            } else {
                const errorMsg = result.data && result.data.error;
                ctx.body = `request token failed ${errorMsg}`;
            }
        } else {
            await next();
        }
    });
};