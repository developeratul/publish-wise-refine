"use client";
import { AppProps } from "@/types";
import { User } from "@supabase/auth-helpers-nextjs";
import React from "react";

const UserContext = React.createContext<User | undefined>(undefined);

export interface UserProviderProps extends AppProps {
  user: User;
}

export default function UserProvider(props: UserProviderProps) {
  const { children, user } = props;
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const userContext = React.useContext(UserContext);

  if (userContext === undefined) {
    throw new Error("This hook must be used within specified context");
  }

  return userContext;
}
