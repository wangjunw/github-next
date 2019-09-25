import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import Thunk from "redux-thunk";

const reducer = () => {};
const initialState = {
  num: 10
};

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(Thunk))
);

export default store;
