import reducer from "./reducer";
import { createStore } from "redux";

const store = createStore(reducer);
export default store;
//@deprecated
//We recommend using the configureStore method of the @reduxjs/toolkit package, which replaces createStore.
// https://cn.redux.js.org/introduction/why-rtk-is-redux-today
// https://docs.pmnd.rs/zustand/getting-started/comparison
//参考 react-next-14 的reduxjs/toolkit
