/**
 * pages下的文件对应路由访问的页面
 * _app.js重写next默认的app组件，中间写自己要加的部分，一般是公共的一些代码
 * 按理说css文件也应该分模块加载，但是目前mini-css-extract-plugin有bug
 */
import App, { Container } from "next/app";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import MyContext from "../libs/my-context";
import withRedux from "../libs/with-redux";
// 每个组件加载都会加载App
class MyApp extends App {
  static async getInitialProps(ctx) {
    const { Component } = ctx;
    let pageProps;
    /**
     * 如果当前Component有getInitialProps，就执行并且传递给对应的组件
     * （如果要重写就必须这样写）
     */
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return {
      pageProps
    };
  }
  // 重写render方法
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Provider store={reduxStore}>
        <MyContext.Provider value="test">
          <Component {...pageProps}></Component>
        </MyContext.Provider>
      </Provider>
    );
  }
}
export default withRedux(MyApp);
