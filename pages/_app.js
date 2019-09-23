/**
 * 重写next默认的app组件，中间写自己要加的部分，一般是公共的一些代码
 * 按理说css文件也应该分模块加载，但是目前mini-css-extract-plugin有bug
 */
import App from 'next/app';
import 'antd/dist/antd.css';
import MyContext from '../libs/my-context';
// 每个组件加载都会加载App
class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps;
        // 如果当前组件有getInitialProps，就把值传递给对应的组件（如果要重写就必须这样写）
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        return {
            pageProps
        };
    }
    render() {
        const { Component, pageProps } = this.props;
        return (
            <MyContext.Provider value="test">
                <Component {...pageProps}></Component>
            </MyContext.Provider>
        );
    }
}
export default MyApp;
