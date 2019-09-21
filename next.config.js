/**
 * next整体配置文件，可以修改next的一些默认配置
 * next默认不支持引入css文件，所以需要使用插件让其支持
 * */

const withCss = require('@zeit/next-css');
if (typeof require !== 'undefined') {
    require.extensions['.css'] = file => {};
}
module.exports = withCss({});
