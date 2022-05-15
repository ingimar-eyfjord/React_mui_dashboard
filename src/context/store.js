import React, { createContext, useReducer } from "react";
const initialState = {};
export const GlobalState = createContext(initialState);
export const StoreProvider = ({ children }) => {
  const Reducer = (state, action) => {
    const name = Object.keys(action);
    const values = Object.values(action);
    return { ...state, [name]: values[0] };
  };
  const [state, dispatch] = useReducer(Reducer, initialState);
  return <GlobalState.Provider value={[state, dispatch]}>{children}</GlobalState.Provider>;
};
