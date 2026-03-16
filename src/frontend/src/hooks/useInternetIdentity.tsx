import { createContext, useContext, useEffect, useState } from "react";

interface InternetIdentityContextType {
  identity: string | null;
  isAuthenticated: boolean;
}

const InternetIdentityContext = createContext<InternetIdentityContextType>({
  identity: null,
  isAuthenticated: false
});

export function InternetIdentityProvider({ children }: { children: React.ReactNode }) {
  const [identity, setIdentity] = useState<string | null>(null);

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