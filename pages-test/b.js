/**
 * 使用hock常用的优化
 */

import { useMemo, memo, useCallback, useReducer, useState } from "react";

const countReducer = (state, action) => {
  switch (action.type) {
    case "add":
      return state + 1;
    default:
      return state;
  }
};
const B = () => {
  const [count, dispatchCount] = useReducer(countReducer, 0);
  const [name, setName] = useState("lala");
  /**
   * 优化，父组件更新防止子组件更新
   * 如果不使用useMemo和useCallback，那么每次组件更新都重新声明config和handleClick
   * useCallback其实是useMemo的简化版，专门用来声明方法
   */
  const config = useMemo(
    () => ({
      color: count > 3 ? "red" : "blue",
      text: `count is ${count}`
    }),
    [count]
  );
  const handleClick = useCallback(() => dispatchCount({ type: "add" }), []);
  //const handleClick = useMemo(() => () => dispatchCount({ type: "add" }), []); 也可以用useMemo实现
  return (
    <div>
      <input
        value={name}
        onChange={e => {
          setName(e.target.value);
        }}
      />
      <Child config={config} onButtonClick={handleClick}></Child>
    </div>
  );
};
const Child = memo(config => {
  console.log("渲染");
  return (
    <button
      onClick={config.onButtonClick}
      style={{ color: config.config.color }}
    >
      {config.config.text}
    </button>
  );
});
export default B;
