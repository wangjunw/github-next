import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension"; //开发调试插件
import Thunk from "redux-thunk";
import axiso from "axios";
const LOGOUT = "LOGOUT";
const userInitialState = {};
const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

const allReducers = combineReducers({
  user: userReducer
});

// 登出
export function logout() {
  return dispatch => {
    axiso
      .post("/logout")
      .then(res => {
        if (res.status === 200) {
          dispatch({ type: LOGOUT });
        } else {
          console.log("logout faild", res);
        }
      })
      .catch(err => {
        console.log("logout faild", err);
      });
  };
}

export default function initializeStore(state) {
  /**
   * 保证每次服务端渲染store都是一个新，否则会保留上次store的值不重置
   * 如果直接导出store在node中会被当做一个nodejs模块，store不会重新生成
   */
  const store = createStore(
    allReducers,
    Object.assign({}, { user: userInitialState }, state),
    composeWithDevTools(applyMiddleware(Thunk))
  );
  return store;
}

/*
//异步dispatch
function addAsync(num) {
  return (dispatch, getState) => {
    setTimeout(() => {
      dispatch({ type: ADD, num });
      console.log(getState());
    }, 5000);
  };
}
store.dispatch({ type: ADD, num: 2 });
store.dispatch(addAsync(10));
console.log(store.getState());
*/
