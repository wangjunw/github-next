import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension"; //开发调试插件
import Thunk from "redux-thunk";

export const ADD = "ADD";
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD:
      return {
        num: state.num + action.num
      };
    default:
      return state;
  }
};
const initialState = {
  num: 10
};

// function addAsync(num) {
//   return (dispatch, getState) => {
//     setTimeout(() => {
//       dispatch({ type: ADD, num });
//       console.log(getState());
//     }, 5000);
//   };
// }
// store.dispatch({ type: ADD, num: 2 });
// store.dispatch(addAsync(10));
// console.log(store.getState());
export default function initializeStore(state) {
  /**
   * 保证每次服务端渲染store都是一个新，否则会保留上次store的值不重置
   * 如果直接导出store在node中会被当做一个nodejs模块，store不会重新生成
   */
  const store = createStore(
    reducer,
    Object.assign({}, initialState, state),
    composeWithDevTools(applyMiddleware(Thunk))
  );
  return store;
}
