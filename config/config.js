const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize"; // 授权链接
const SCOPE = "user"; //授权的权限
const client_id = "9db0f1e08f56c679216b";
module.exports = {
  github: {
    request_token_url: "https://github.com/login/oauth/access_token",
    client_id,
    client_secret: "59b3242c55bb5df0ebfb2ed08e02db375be8c7e1"
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
};
