/**
 * 重写document
 * 该文件只有服务端渲染才会生效
 */
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // 支持styled-components
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      // collectStyles拿到渲染完整个app之后的css代码，挂载到sheet上
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
          // enhanceComponent: Component => Component
        });
      const props = await Document.getInitialProps(ctx);
      return {
        ...props,
        // 默认样式和styled-components样式合并
        styles: (
          <>
            {props.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    return (
      <Html>
        <Head>
          <style></style>
        </Head>
        <body className="test">
          <Main></Main>
          <NextScript></NextScript>
        </body>
      </Html>
    );
  }
}
export default MyDocument;
