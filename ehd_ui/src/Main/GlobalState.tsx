import React, { createContext, ReactNode, useEffect, useState } from "react";

export const contextAuth = createContext<any>("");

const GlobalState = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<any>("");
  useEffect(() => {
    var role = localStorage.getItem("role");
    setAuthToken(role);
    console.log("hell" + role);
  }, [authToken]);

  return (
    <contextAuth.Provider value={[authToken, setAuthToken]}>
      {children}
    </contextAuth.Provider>
  );
};

export default GlobalState;
