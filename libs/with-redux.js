import React from "react";
import createStore from "../store/store";
const isServer = typeof window === "undefined";
const _NEXT_REDUX_STORE_ = "_NEXT_REDUX_STORE_";

function getOrCreateStore(initialState) {
  // 如果是服务端，重新创建一个store
  if (isServer) {
    return createStore(initialState);
  }
  /**
   * 如果不是服务端，判断window下是否存在_NEXT_REDUX_STORE_
   * 保证每次渲染组件执行app的getInitialProps都使用同一个store
   */
  if (!window[_NEXT_REDUX_STORE_]) {
    window[_NEXT_REDUX_STORE_] = createStore(initialState);
  }
  return window[_NEXT_REDUX_STORE_];
}
export default Comp => {
  class WithReduxApp extends React.Component {
    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }
    render() {
      const { Component, pageProps, ...rest } = this.props;
      if (pageProps) {
        pageProps.test = "123455";
      }
      return (
        <Comp
          Component={Component}
          pageProps={pageProps}
          reduxStore={this.reduxStore}
          {...rest}
        />
      );
    }
  }

  /**
   * 集成服务端redux数据到组件
   * 返回一个新的组件一定要有getInitialProps方法，否则报错
   * 每次服务端渲染或者页面跳转都会执行
   */
  WithReduxApp.getInitialProps = async ctx => {
    let reduxStore;

    // 只有在服务端渲染时才能获取到req.session
    if (isServer) {
      const { req } = ctx.ctx;
      const session = req.session;
      // 如果session有用户信息，存入store中
      if (session && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo
        });
      } else {
        reduxStore = getOrCreateStore();
      }
    } else {
      reduxStore = getOrCreateStore();
    }

    ctx.reduxStore = reduxStore;

    let appProps = {};
    if (typeof Comp.getInitialProps === "function") {
      appProps = await Comp.getInitialProps(ctx);
    }
    return {
      ...appProps,
      initialReduxState: reduxStore.getState()
    };
  };
  return WithReduxApp;
};
