import React, { createContext, ReactNode, useEffect, useState } from "react";

export const contextAuth = createContext<any>("");

const GlobalState = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<any>("");
  useEffect(() => {
    var role = localStorage.getItem("role");
    setRole(role);
    console.log("hell" + role);
  }, [role]);

  return (
    <contextAuth.Provider value={[role, setRole]}>
      {children}
    </contextAuth.Provider>
  );
};

export default GlobalState;
