/**
 * 各种hook
 */
import {
  useEffect,
  useState,
  useReducer,
  useContext,
  useRef,
  useLayoutEffect
} from "react";
import myContext from "../libs/my-context";
const countReducer = (state, action) => {
  switch (action.type) {
    case "add":
      return state + 1;
    default:
      return state;
  }
};
const Comp = () => {
  // const [count, setCount] = useState(0);
  const [count, dispatchCount] = useReducer(countReducer, 0);
  // 使用context
  const context = useContext(myContext);
  // 使用ref
  const myRef = useRef();

  // 第二个参数数组中的内容变化才会执行里面代码，为空的话只在挂在和卸载时执行
  useEffect(() => {
    const timer = setInterval(() => {
      // setCount(c => c + 1);
      dispatchCount({ type: "add" });
    }, 1000);
    console.log(myRef);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // 在挂在dom之前执行，useEffect在挂载之后执行
  useLayoutEffect(() => {
    console.log("layout effect");
  }, [count]);
  return (
    <div>
      <p>{count}</p>
      <h3>{context}</h3>
      <input ref={myRef} />
      <style jsx>{`
        p {
          color: blue;
        }
      `}</style>
    </div>
  );
};

export default Comp;
