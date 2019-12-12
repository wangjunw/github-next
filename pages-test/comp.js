/**
 * 各种hook
 */

import { connect } from "react-redux";
import { ADD } from "../store/store";
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
const Comp = ({ counter, add }) => {
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
  // useLayoutEffect(() => {
  //   console.log("layout effect");
  // }, [count]);
  return (
    <div>
      <p>{count}</p>
      <h3>{context}</h3>
      <h1>{counter}</h1>
      <input
        ref={myRef}
        onChange={e => {
          add(100);
        }}
      />
      <style jsx>{`
        p {
          color: blue;
        }
      `}</style>
    </div>
  );
};
function mapStateToProps(state) {
  return {
    counter: state.num
  };
}
function mapDispatchToProps(dispatch) {
  return {
    add: num => dispatch({ type: "ADD", num })
  };
}
Comp.getInitialProps = async ({ reduxStore }) => {
  reduxStore.dispatch({ type: ADD, num: 100 });
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Comp);
