/**
 * pages下的文件对应路由访问的页面
 * _app.js重写next默认的app组件，中间写自己要加的部分，一般是公共的一些代码
 * 按理说css文件也应该分模块加载，但是目前mini-css-extract-plugin有bug
 */
import App from "next/app";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import withRedux from "../libs/with-redux";
import Layout from "../components/Layout";
import PageLoading from "../components/PageLoading";
import axios from "axios";
// 每个组件加载都会加载App
class MyApp extends App {
  state = {
    loading: false
  };
  startLoading = () => {
    this.setState({
      loading: true
    });
  };
  stopLoading = () => {
    this.setState({
      loading: false
    });
  };
  componentDidMount() {
    // 监听路由变化，控制loading
    Router.events.on("routeChangeStart", this.startLoading);
    Router.events.on("routeChangeComplete", this.stopLoading);
    Router.events.on("routeChangeError", this.stopLoading);
    axios.get(`/github/search/repositories?q=react`).then(res => {
      console.log(res);
    });
  }
  componentWillUnmount() {
    Router.events.off("routeChangeStart", this.startLoading);
    Router.events.off("routeChangeComplete", this.stopLoading);
    Router.events.off("routeChangeError", this.stopLoading);
  }
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
        {this.state.loading ? <PageLoading /> : ""}
        <Layout>
          <Link href="/">
            <a>index</a>
          </Link>
          <Link href="/detail">
            <a>detail</a>
          </Link>
          <Component {...pageProps}></Component>
        </Layout>
      </Provider>
    );
  }
}
export default withRedux(MyApp);
