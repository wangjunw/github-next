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
  const config = useMemo(
    () => ({
      color: count > 3 ? "red" : "blue",
      text: `count is ${count}`
    }),
    [count]
  );
  const handleCilck = useCallback(() => dispatchCount({ type: "add" }), []);
  return (
    <div>
      <input
        value={name}
        onChange={e => {
          setName(e.target.value);
        }}
      />
      <Child config={config} onButtonClick={handleCilck}></Child>
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
