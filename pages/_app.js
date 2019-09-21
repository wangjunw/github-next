/**
 * 重写next默认的app组件，我们不需要修改其业务代码所以直接引入导出即可
 * 中间写自己要加的部分，按理说css文件也应该分模块加载，但是目前mini-css-extract-plugin有bug
 */
import App from 'next/app';
import 'antd/dist/antd.css';
export default App;
