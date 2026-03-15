import { createContext, useContext, useEffect, useState } from "react";

const InternetIdentityContext = createContext({
  identity: null,
  isAuthenticated: false
});

export function InternetIdentityProvider({ children }) {
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    const mockIdentity = "mock-principal";
    setIdentity(mockIdentity);
  }, []);

  return (
    <InternetIdentityContext.Provider value={{
      identity,
      isAuthenticated: !!identity
    }}>
      {children}
    </InternetIdentityContext.Provider>
  );
}

export function useInternetIdentity() {
  return useContext(InternetIdentityContext);
}
