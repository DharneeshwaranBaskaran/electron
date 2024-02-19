import { createContext, useContext } from "react";

export const LoginContext = createContext();

export const useLoginContext = () => {
  return useContext(LoginContext);
};