import { createContext } from 'react';

type CheckedState = boolean | "indeterminate";

 const CheckStatusContext = createContext<CheckedState>(false);
 export default CheckStatusContext;
 export type { CheckedState };