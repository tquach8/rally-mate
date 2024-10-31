// UserContext.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "@/app/lib/definitions";

const initialUser = {
  id: "1",
} as User;
export const UserContext = createContext(initialUser);

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  user: User; // replace `any` with your user type
  children: ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
