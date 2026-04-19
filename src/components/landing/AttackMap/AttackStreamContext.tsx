import { createContext, useContext, ReactNode } from "react";
import { useAttackStream, AttackEvent } from "@/hooks/use-attack-stream";

interface AttackStreamContextValue {
  events: AttackEvent[];
  counter: number;
  connected: boolean;
}

const AttackStreamContext = createContext<AttackStreamContextValue | null>(null);

export const AttackStreamProvider = ({ children }: { children: ReactNode }) => {
  const stream = useAttackStream(30);
  return (
    <AttackStreamContext.Provider value={stream}>
      {children}
    </AttackStreamContext.Provider>
  );
};

export const useAttackStreamContext = () => {
  const ctx = useContext(AttackStreamContext);
  if (!ctx) {
    throw new Error("useAttackStreamContext must be used inside AttackStreamProvider");
  }
  return ctx;
};
