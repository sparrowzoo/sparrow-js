import { createStore } from "redux";

type State = {
  count: number;
};

type Action = {
  type: "increment" | "decrement";
  qty: number;
};

const countReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + action.qty };
    case "decrement":
      return { count: state.count - action.qty };
    default:
      return state;
  }
};

const countStore = createStore(countReducer);
