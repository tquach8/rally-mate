// UserContext.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "@/app/lib/definitions";

export const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  user: User; // replace `any` with your user type
  children: ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
