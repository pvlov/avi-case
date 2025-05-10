"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useMedicalStore } from "./store";

// Create context with initial data
const MedicalStoreContext = createContext<{
  ready: boolean;
}>({
  ready: false,
});

// Provider component
export function MedicalStoreProvider({ children }: { children: ReactNode }) {
  // Track if the store is ready (hydrated from localStorage)
  const ready = useStoreReady();

  return <MedicalStoreContext.Provider value={{ ready }}>{children}</MedicalStoreContext.Provider>;
}

// Hook to check if the store is hydrated from localStorage
function useStoreReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Zustand store is always immediately ready in client components
    // This helps prevent hydration mismatches
    setReady(true);
  }, []);

  return ready;
}

// Hook to use the medical store context
export function useMedicalStoreReady() {
  const context = useContext(MedicalStoreContext);
  if (context === undefined) {
    throw new Error("useMedicalStoreReady must be used within a MedicalStoreProvider");
  }
  return context.ready;
}
