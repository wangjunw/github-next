/**
 * 中间主内容区域的样式
 */
const style = {
  width: "100%",
  maxWidth: "1200px",
  marginLeft: "auto",
  marginRight: "auto"
};
export default ({ children, comp: Comp }) => {
  return <Comp style={style}>{children}</Comp>;
};
