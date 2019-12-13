/**
 * 区别客户端和服务端请求的封装
 * 因为客户端请求会在路径前默认添加当前请求路径，
 * 而服务端请求会默认添加127.0.0.1:80所以请求失败
 */
const axios = require("axios");
const config = require("../config/config");

const isServer = typeof window === "undefined";

async function requestGithub(url, method, data, headers) {
  return await axios({
    url: `${config.github.api_base_url}${url}`,
    data,
    method,
    headers
  });
}
async function request({ url, method = "GET", data = {} }, req, res) {
  if (!url) {
    throw Error("url is must params");
  }
  if (isServer) {
    const session = req.session;
    const githubAuth = session.githubAuth || {};
    let headers = {};
    if (githubAuth.access_token) {
      headers[
        "Authorization"
      ] = `${githubAuth.token_type} ${githubAuth.access_token}`;
    }
    return await requestGithub(url, method, data, headers);
  } else {
    // 如果是客户端请求，则请求中间层接口，所以拼接/github
    return await axios({
      method,
      url: `/github${url}`,
      data
    });
  }
}

module.exports = {
  request,
  requestGithub
};
