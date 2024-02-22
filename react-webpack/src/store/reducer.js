const initState = 0;
export default function reducer(state = initState, action) {
  console.log(state);
  switch (action.type) {
    case 'addN':
      return state + parseInt(action.payload);
    case 'sub':
      return state - 1;
    default:
      return state;
  }
}
