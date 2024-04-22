import { createStore } from 'redux';
import reducer from './reducer';

/**
 * import { createSlice, configureStore } from '@reduxjs/toolkit'
 *
 * const countSlice = createSlice({
 *   name: 'count',
 *   initialState: { value: 0 },
 *   reducers: {
 *     incremented: (state, qty: number) => {
 *       // Redux Toolkit does not mutate the state, it uses the Immer library
 *       // behind scenes, allowing us to have something called "draft state".
 *       state.value += qty
 *     },
 *     decremented: (state, qty: number) => {
 *       state.value -= qty
 *     },
 *   },
 * })
 *
 * const countStore = configureStore({ reducer: countSlice.reducer })
 * @type {Store<unknown, Action>}
 */
/**
 * @deprecated
 * We recommend using the configureStore method of the @reduxjs/toolkit package, which replaces createStore.
 */
const store = createStore(reducer);

export default store;

// https://docs.pmnd.rs/zustand/getting-started/comparison
/**
 * import { createStore } from 'redux'
 * import { useSelector, useDispatch } from 'react-redux'
 *
 * type State = {
 *   count: number
 * }
 *
 * type Action = {
 *   type: 'increment' | 'decrement'
 *   qty: number
 * }
 *
 * const countReducer = (state: State, action: Action) => {
 *   switch (action.type) {
 *     case 'increment':
 *       return { count: state.count + action.qty }
 *     case 'decrement':
 *       return { count: state.count - action.qty }
 *     default:
 *       return state
 *   }
 * }
 *
 * const countStore = createStore(countReducer)
 */